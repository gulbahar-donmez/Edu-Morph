import os
import sys
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from models import User, Base, TestResult
from database import engine, get_db
from schemas import UserCreate, User as UserSchema, Token, TokenData, ContentRequest, TestResult as TestResultSchema
from passlib.context import CryptContext
from jose import JWTError, jwt
import google.generativeai as genai

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Güvenlik ayarları
SECRET_KEY = "acoztm3revp1vfj7ld5sz2ndg5xp79r9fnr2p4hx2dy63h6a8efhj6rm54u8evh8"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 saat

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Gemini API yapılandırması
GEMINI_API_KEY = "AIzaSyDW8dyttXw4sq4I6cYjehFEJyh0JtSvqJs"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash-latest')

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/register", response_model=Token)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Email kontrolü
        existing_email = db.query(User).filter(User.email == user.email).first()
        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Bu email adresi zaten kullanımda"
            )

        # Kullanıcı adı kontrolü
        existing_username = db.query(User).filter(User.username == user.username).first()
        if existing_username:
            raise HTTPException(
                status_code=400,
                detail="Bu kullanıcı adı zaten kullanımda"
            )

        # Yeni kullanıcı oluştur
        hashed_password = get_password_hash(user.password)
        new_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            first_name=user.first_name,
            last_name=user.last_name,
            role="user",
            is_active=True
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Access token oluştur
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": new_user.username}, expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Kayıt işlemi sırasında bir hata oluştu: {str(e)}"
        )

@app.post("/token", response_model=Token)
async def login_for_access_token(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        print(f"Login attempt for username: {username}")  # Debug login attempt
        user = db.query(User).filter(User.username == username).first()
        
        if not user:
            print("User not found")  # Debug user not found
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not verify_password(password, user.hashed_password):
            print("Password verification failed")  # Debug password verification
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        print(f"Token created for user: {user.username}")  # Debug token creation
        
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug error
        raise HTTPException(
            status_code=500,
            detail=f"Giriş işlemi sırasında bir hata oluştu: {str(e)}"
        )

@app.post("/create-sample-user")
async def create_sample_user(db: Session = Depends(get_db)):
    try:
        # Örnek kullanıcı bilgileri
        sample_user = User(
            username="testuser",
            email="test@example.com",
            first_name="Test",
            last_name="User",
            hashed_password=get_password_hash("test123"),
            role="student",
            is_active=True
        )
        
        # Kullanıcıyı veritabanına ekle
        db.add(sample_user)
        db.commit()
        db.refresh(sample_user)
        
        print(f"Sample user created: {sample_user.username}")  # Debug user creation
        
        return {
            "message": "Örnek kullanıcı başarıyla oluşturuldu",
            "user": {
                "username": sample_user.username,
                "email": sample_user.email
            }
        }
    except Exception as e:
        db.rollback()
        print(f"Error creating sample user: {str(e)}")  # Debug error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Kullanıcı oluşturulurken hata oluştu: {str(e)}"
        )

@app.post("/api/generate-content")
async def generate_content(request: ContentRequest, current_user: User = Depends(get_current_user)):
    try:
        # Gemini API'yi yapılandır
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        # Prompt'u zenginleştir
        enhanced_prompt = f"""
        Lütfen aşağıdaki konu hakkında detaylı ve kapsamlı bir analiz yapın.
        Analiz en az 500 kelime uzunluğunda olsun ve şu bölümleri içersin:
        
        1. Genel Değerlendirme
        2. Detaylı Analiz
        3. Öneriler ve Stratejiler
        4. Uygulama İpuçları
        
        Analiz edilecek konu:
        {request.prompt}
        
        Lütfen yanıtınızı Türkçe olarak verin ve teknik terimleri açıklayın.
        """
        
        # AI'dan yanıt al
        response = model.generate_content(enhanced_prompt)
        
        if not response or not response.text:
            raise HTTPException(status_code=500, detail="AI yanıtı alınamadı")
            
        return {"content": response.text}
        
    except Exception as e:
        print(f"AI içerik üretme hatası: {str(e)}")
        raise HTTPException(status_code=500, detail=f"İçerik üretilirken bir hata oluştu: {str(e)}")

@app.post("/api/save-test-results")
async def save_test_results(
    request: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        test_type = request.get('testType')
        results = request.get('results')
        
        if not test_type or not results:
            raise HTTPException(
                status_code=400,
                detail="Test tipi ve sonuçları gereklidir"
            )
            
        # Test sonuçlarını veritabanına kaydet
        test_result = TestResult(
            user_id=current_user.id,
            test_type=test_type,
            results=results,
            created_at=datetime.utcnow()
        )
        
        db.add(test_result)
        db.commit()
        db.refresh(test_result)
        
        return {
            "message": "Test sonuçları başarıyla kaydedildi",
            "test_id": test_result.id
        }
        
    except Exception as e:
        db.rollback()
        print(f"Test sonuçları kaydedilirken hata: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Test sonuçları kaydedilirken bir hata oluştu: {str(e)}"
        )

@app.get("/api/test-results", response_model=List[TestResultSchema])
async def get_test_results(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Kullanıcının test sonuçlarını getir
        test_results = db.query(TestResult).filter(
            TestResult.user_id == current_user.id
        ).order_by(TestResult.created_at.desc()).all()
        
        return test_results
        
    except Exception as e:
        print(f"Test sonuçları alınırken hata: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Test sonuçları alınırken bir hata oluştu: {str(e)}"
        )