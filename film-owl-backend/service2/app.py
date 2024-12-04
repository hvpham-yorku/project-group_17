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
    favorites: Optional[List[int]] = Field(
        default=None, sa_column=Column(ARRAY(Integer()))
    )


class UpdateFavoritesRequest(BaseModel):
    movie_id: int


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


@app.get("/users/{user_id}/favorites")
def get_user_by_id(user_id: int):
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")
    with Session(engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()
        return user.favorites


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
        if not user:
            raise HTTPException(status_code=400, detail="Invalid email or password")

        if request.password != user.password:
            raise HTTPException(status_code=400, detail="Invalid email or password")

        return {"message": "Login successful", "user": user.id}


# @app.put("/users/{username}/favourites")
# def add_to_favorites(username: str, movie_id: int):
#     engine = create_engine("postgresql://postgres:postgres@db/film-owl")
#     with Session(engine) as session:
#         user_db = session.exec(select(User).where(User.username == username)).first()

#         if user_db is None:
#             raise HTTPException(status_code=404, detail="User not found")

#         if user_db.favorites is None:
#             user_db.favorites = []

#         if movie_id not in user_db.favorites:
#             user_db.favorites.append(movie_id)

#         session.add(user_db)
#         session.commit()
#         session.refresh(user_db)

#         return {"message": "Movie added to favorites", "favorites": user_db.favorites}


@app.get("/users/{username}/favourites")
def get_user_favourite_movies(username: str):
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        favorite_movie_ids = user.favorites or []

        logging.debug(f"User {username} has favorite movie IDs: {favorite_movie_ids}")

        if not favorite_movie_ids:
            return []

        statement = select(Movie).where(Movie.id.in_(favorite_movie_ids))
        favorite_movies = session.exec(statement).all()

        logging.debug(f"User {username} has favorite movie IDs: {favorite_movie_ids}")

        return favorite_movies


@app.put("/users/{username}/favourites")
def update_user_favourites(username: str, request: UpdateFavoritesRequest):
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")
    with Session(engine) as session:
        user_db = session.exec(select(User).where(User.username == username)).first()

        if not user_db:
            raise HTTPException(status_code=404, detail="User not found")

        current_favorites = user_db.favorites or []

        if request.movie_id not in current_favorites:
            current_favorites.append(request.movie_id)

        user_db.favorites = current_favorites
        session.add(user_db)
        session.commit()

        logging.debug(
            f"After commit, favorites for user {username}: {user_db.favorites}"
        )

        logging.debug(f"Updated favorites for user {username}: {current_favorites}")

        return {"message": "Favorites updated", "favorites": current_favorites}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
