"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchMovies, Movie } from "@/lib/api";

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || ""; // Retrieve query from URL
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    const getMovies = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await fetchMovies(query); // Use reusable API function
        setMovies(results);
      } catch (err) {
        setError(err.message || "An error occurred while fetching movies.");
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-teal-700 dark:text-teal-300 mb-8">
        Results for "{query}"
      </h1>
      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-500">Error: {error}</p>
      )}
      {!loading && !error && movies.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No results found for "{query}".
        </p>
      )}
      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center"
            >
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
                alt={movie.Title}
                className="rounded-md w-full h-64 object-cover mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">
                {movie.Title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{movie.Year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;