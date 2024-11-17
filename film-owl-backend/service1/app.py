from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from typing import Optional

from sqlmodel import Field, Session, SQLModel, create_engine, select

import requests

from datetime import datetime


apiKey = "f0c832b0"


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


@app.get("/search/{movie_title}")
def get_search_results(movie_title: str):

    search_url = f"http://www.omdbapi.com/?&apikey={apiKey}&s={movie_title}"

    response = requests.get(search_url)
    search_data = response.json()

    if search_data.get("Response") == "True":
        movies = []
        engine = create_engine("postgresql://postgres:postgres@db/film-owl")

        for m in search_data["Search"]:
            movie_data = get_movie_details_by_title(m["Title"])
            imdb_id = movie_data["imdbID"]

            with Session(engine) as session:
                existing_movie = session.exec(
                    select(Movie).where(Movie.imdb_id == imdb_id)
                ).first()

                if existing_movie:
                    movies.append(existing_movie)
                else:
                    movie = Movie(
                        title=movie_data["Title"],
                        release_date=datetime.strptime(
                            movie_data["Released"], "%d %b %Y"
                        ),
                        image_url=movie_data["Poster"],
                        plot=movie_data["Plot"],
                        genre=movie_data["Genre"].split(", ")[0],
                        created_at=datetime.now(),
                        duration_minutes=movie_data["Runtime"],
                        imdb_id=imdb_id,
                    )

                    session.add(movie)
                    session.commit()
                    session.refresh(movie)
                    movies.append(movie)

        return movies
    else:
        return {"Error": "Movie(s) Not Found!"}


def get_movie_details_by_title(movie_title: str):
    url = f"http://www.omdbapi.com/?t={movie_title}&plot=full&apikey={apiKey}"
    response = requests.request("GET", url)
    movie_data = response.json()

    return movie_data


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
