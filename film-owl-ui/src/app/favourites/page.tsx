"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Movie } from "../models/movie";
import Image from "next/image";
import Link from "next/link";

const FavouritesPage: React.FC = () => {

  let user = localStorage.getItem("user");
  const [results, setResults] = useState<Movie[]>([]);
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  let displayName = "";
  if (user) {
    displayName = JSON.parse(user).email;
  }

  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     if (!user) {
  //       return;
  //     }

  //     setLoading(true);

  //     try {
  //       const response = await fetch(`http://localhost:5001/users/${displayName}/favourites`,);

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch favorite movies");
  //       }

  //       const data: Movie[] = await response.json();
  //       setResults(data);
  //       console.log("Fetched data:", data);
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "An error occurred fetching favourites");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFavorites();
  // }, [displayName]);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:5001/users/${displayName}/favourites`);
        if (!response.ok) {
          throw new Error("Failed to fetch favorite movies");
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [displayName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-4xl font-bold text-teal-700 dark:text-teal-300 mb-14">
        <h4>{displayName}'s Favourites</h4>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {results.map((movie) => (
            <div key={movie.id} className="rounded-lg shadow-lg bg-white dark:bg-gray-800">
              <Image
                src={movie.image_url}
                alt={movie.title}
                className="w-full h-48 object-cover rounded-t-lg"
                width={500}
                height={750}
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-teal-600 dark:text-teal-300">{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg font-semibold text-gray-500 dark:text-gray-300">No favorites yet!</p>
      )}
    </div>
  );

};

export default FavouritesPage;