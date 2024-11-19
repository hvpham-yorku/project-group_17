from fastapi import FastAPI, Query

app = FastAPI()

from typing import Optional

from sqlmodel import Field, Session, SQLModel, create_engine, select

class Movie(SQLModel, table=True):
    __tablename__ = "movies"
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    genre: str
    release_date: str
    duration_minutes: Optional[int] = None
    image_url: Optional[str] = None
    created_at: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Welcome to Film Owl service1"}

@app.get("/movies")
def read__all_movies():
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")

    with Session(engine) as session:
        statement = select(Movie)
        movies = session.exec(statement).all()
        return movies

@app.post("/movies")
def create_movie(movie: Movie):
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")

    with Session(engine) as session:
        session.add(movie)
        session.commit()
        session.refresh(movie)
        return movie

@app.get("/movies/{movie_id}")
def get_movie_by_id(movie_id: int):
    engine = create_engine("postgresql://postgres:postgres@db/film-owl")

    with Session(engine) as session:
        statement = select(Movie).where(Movie.id == movie_id)
        movie = session.exec(statement).first()
        return movie

@app.get("/search{query}")
def search_movies(query: str):
   engine = create_engine("postgresql://postgres:postgres@db/film-owl")
   with Session(engine) as session:
        statement = select(Movie).where(Movie.title.ilike(f"%{query}%"))
        results = session.exec(statement).all()
        return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
