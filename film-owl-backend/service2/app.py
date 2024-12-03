# import sys
# import os

# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# from service1.app import Movie

from fastapi import FastAPI, HTTPException, Depends
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
    print(f"Received signup request: {user}")
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")
    with Session(engine) as session:
      existing_user = session.exec(
      select(User).where((User.email == user.email) | (User.username == user.username))
       ).first()
      if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already exists")
        
      if not user.password:
        raise HTTPException(status_code=400, detail="Password cannot be empty")
      
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
    # return {"message": "User successfully created", "username": user.username,}

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
        
        return {"message": "Login successful", "user": user.username}
        # return {"message": "Login successful", "user": {"username": request.username, "email": user.email, "id": user.id}}

# def get_db():
#     engine = create_engine("postgresql://postgres:postgres@db/film-owl")
#     with Session(engine()) as session:
#         yield session

# @app.get("/favorites/{user_id}")
# def get_user_favourites(user_id: int, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     movie_ids = user.favorites
#     movies = db.query(Movie).filter(Movie.id.in_(movie_ids)).all()

#     return {"favourites": movies}

# @app.post("/add_favourite/{user_id}/{movie_id}")
# def add_favourite(user_id: int, movie_id: int, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
    
#     if movie_id in user.favorites:
#         raise HTTPException(status_code=400, detail="Movie already in favourites")
#     user.favorites.append(movie_id)
#     db.commit()
#     db.refresh(user)

#     return {"message": "Movie added to favourites", "favourites": user.favorites}

# @app.delete("/remove_favourite/{user_id}/{movie_id}")
# def remove_favourite(user_id: int, movie_id: int, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     if movie_id not in user.favorites:
#         raise HTTPException(status_code=400, detail="Movie not in favourites")

#     user.favorites.remove(movie_id)
#     db.commit()
#     db.refresh(user)

#     return {"message": "Movie removed from favourites", "favourites": user.favorites}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
