from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LearningStyleCreate(BaseModel):
    visual_score: int
    auditory_score: int
    kinesthetic_score: int
    dominant_style: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ContentRequest(BaseModel):
    prompt: str

class TestResult(BaseModel):
    id: int
    user_id: int
    test_type: str
    results: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True