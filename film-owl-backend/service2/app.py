from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from sqlalchemy import Integer
from sqlmodel import (
    Field,
    Session,
    SQLModel,
    create_engine,
    select,
    ARRAY,
    Integer,
    String,
    Column,
)
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY
import logging

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DATABASE_URL = "postgresql://postgres:postgres@db/film-owl"
engine = create_engine(DATABASE_URL, echo=True)  # Enable query logging


# SQLModel Definitions
class Movie(SQLModel, table=True):
    __tablename__ = "movies"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    release_date: datetime
    plot: str
    genre: str
    imdb_id: str
    duration_minutes: Optional[str] = None
    image_url: Optional[str] = None
    created_at: Optional[str] = None


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    password: str
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    favourites: Optional[List[int]] = Field(
        default_factory=list, sa_column=Column(ARRAY(Integer()))
    )


# Pydantic Request/Response Models
class LoginRequest(BaseModel):
    email: str
    password: str


class UpdateFavouritesRequest(BaseModel):
    id: int


# Routes
@app.get("/users")
def get_all_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return users


@app.post("/users")
def create_user(user: User):
    with Session(engine) as session:
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


@app.get("/users/{user_id}")
def get_user_by_id(user_id: int):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.id == user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user


@app.get("/users/{user_id}/favourites")
def get_user_favourites(user_id: int):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.id == user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user.favourites


@app.put("/users/{user_id}")
def update_user(user_id: int, user: User):
    with Session(engine) as session:
        user_db = session.exec(select(User).where(User.id == user_id)).first()
        if not user_db:
            raise HTTPException(status_code=404, detail="User not found")

        # Update fields
        user_db.username = user.username
        user_db.email = user.email
        user_db.password = user.password
        user_db.favourites = user.favourites or user_db.favourites

        session.add(user_db)
        session.commit()
        session.refresh(user_db)
        return user_db


@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.id == user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        session.delete(user)
        session.commit()
        return user


@app.post("/login")
def login(request: LoginRequest):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == request.email)).first()
        if not user or request.password != user.password:
            raise HTTPException(status_code=400, detail="Invalid email or password")

        return {"message": "Login successful", "user_id": user.id}


@app.get("/users/{user_id}/favourites/movies")
def get_user_favourite_movies(user_id: int):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.id == user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        favorite_movie_ids = user.favourites
        if not favorite_movie_ids:
            return []

        movies = session.exec(
            select(Movie).where(Movie.id.in_(favorite_movie_ids))
        ).all()
        return movies
