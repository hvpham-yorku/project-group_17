from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from sqlalchemy import Integer
from sqlmodel import Field, Session, SQLModel, create_engine, select, ARRAY, Integer, String, Column
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    password: str
    created_at: Optional[datetime] = Field(default=datetime.now())
    favorites: Optional[List[int]] = Field(default=None, sa_column=Column(ARRAY(Integer())))

@app.get("/users")
def get_all_users():
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")
    with Session(engine) as session:
        statement = select(User)
        users = session.exec(statement).all()
        return users

@app.post("/users")
def create_user(user: User):
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

@app.get("/users/{user_id}")
def get_user_by_id(user_id: int):
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")
    with Session(engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()
        return user

@app.put("/users/{user_id}")
def update_user(user_id: int, user: User):
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")
    with Session(engine) as session:
        statement = select(User).where(User.id == user_id)
        user_db = session.exec(statement).first()
        if user_db is None:
            return None
        user_db.username = user.username
        user_db.email = user.email
        user_db.password = user.password
        user_db.favorites = user.favorites
        session.add(user_db)
        session.commit()
        session.refresh(user_db)
        return user_db

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")
    with Session(engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()
        session.delete(user)
        session.commit()
        return user

@app.post("/login")
def login(request: LoginRequest):
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == request.email)).first()
        if(not user):
            raise HTTPException(status_code=400, detail="Invalid email or password")

        if(request.password != user.password):
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        return {"message": "Login successful", "user": user.id}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
