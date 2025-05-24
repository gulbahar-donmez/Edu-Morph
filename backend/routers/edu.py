from fastapi import APIRouter, Depends, Request
from models import User
from database import SessionLocal
from yedek.auth import get_current_user
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import declarative_base

router = APIRouter(
    prefix="/todo",
    tags=["Todo"],
)

templates = Jinja2Templates(directory="templates/")

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/todo-page")
async def read_all_by_user(request: Request, current_user: User = Depends(get_current_user)):
    return templates.TemplateResponse("todo.html", {
        "request": request,
        "user": current_user
    })

