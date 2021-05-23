from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session

from ..sql_db import models, schemas, crud
from ..sql_db.database import get_db

router = APIRouter()


@router.post("/")
async def create_user(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = schemas.UserCreate(email=email, password=password)
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

