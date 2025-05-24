# Modern Web Projesi

Bu proje, FastAPI backend ve React frontend kullanılarak oluşturulmuş modern bir web uygulamasıdır.

## Proje Yapısı

```
.
├── backend/           # FastAPI backend
│   └── main.py       # Ana uygulama dosyası
├── frontend/         # React frontend
│   ├── src/
│   │   └── App.js   # Ana React bileşeni
│   └── package.json # Frontend bağımlılıkları
└── requirements.txt  # Backend bağımlılıkları
```

## Kurulum

### Backend Kurulumu

1. Python sanal ortamı oluşturun:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Gerekli paketleri yükleyin:
```bash
pip install -r requirements.txt
```

3. Backend'i çalıştırın:
```bash
cd backend
uvicorn main:app --reload
```

### Frontend Kurulumu

1. Frontend bağımlılıklarını yükleyin:
```bash
cd frontend
npm install
```

2. Frontend'i çalıştırın:
```bash
npm start
```

## Kullanım

- Backend: http://localhost:8000
- Frontend: http://localhost:3000 