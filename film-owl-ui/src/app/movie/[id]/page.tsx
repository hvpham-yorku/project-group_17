"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Movie } from "../../models/movie";
import { Button } from "@nextui-org/react";


const MoviePage: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  let user = localStorage.getItem("user");
  let displayName = "";
  if (user) {
    displayName = JSON.parse(user).email;
  }

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `http://localhost:5002/movies/${encodeURIComponent(
            id as string
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movie");
        }
        const data: Movie = await response.json();
        setMovie(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">
          Error: {error}
        </p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">No movie found</p>
      </div>
    );
  }

  // const handleFavourite = async () => {
  //   try {
  //     const userResponse = await fetch(`http://localhost:5001/users/${displayName}/favourites`);
  //     if (!userResponse.ok) {
  //       throw new Error("Failed to fetch user favorites");
  //     }

  //     const userFavorites = await userResponse.json();

  //     const updatedFavorites = [...userFavorites, movie.id];

  //     const response = await fetch(`http://localhost:5001/users/${displayName}/favourites?movie_id=${movie.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //       favorites: updatedFavorites,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to add movie to favorites");
  //     }

  //     alert("Movie added to favorites!");

  //   } catch (err) {
  //     console.error("Error adding movie to favorites:", err);
  //     alert("Failed to add movie to favorites.");
  //   }
  // };

  const handleFavourite = async () => {
    try {
      const response = await fetch(`http://localhost:5001/users/${displayName}/favourites?movie_id=${movie.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movie.id })
        
      });

      if (!response.ok) {
        throw new Error("Failed to add movie to favorites");
      }
      
      alert("Movie added to favorites!");
    } catch (err) {
      console.error("Error adding movie to favorites:", err);
      alert("Failed to add movie to favorites.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center">
        <Image
          src={movie.image_url}
          alt={movie.title}
          className="w-full h-full md:w-1/3 object-cover rounded-lg shadow-lg"
          width={500}
          height={750}
        />
        <div className="md:w-1/2 md:pl-8 flex flex-col items-start">
          <div className="md:ml-8">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-700 mb-4">{movie.plot}</p>
            <p className="text-lg text-gray-500">
              <strong>Release Date:</strong> {movie.release_date}
            </p>
            <p className="text-lg text-gray-500">
              <strong>Genre:</strong> {movie.genre}
            </p>
            {
              user &&

              <button type="button" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700" onClick={handleFavourite}>
                Favourite
              </button>
            }
          </div>
          <div className="md:ml-8 mt-8">
            <h2 className="text-2xl font-bold mb-1">Reviews and Comments</h2>
            <p>Next sprint implementation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
