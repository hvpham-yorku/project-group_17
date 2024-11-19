"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchMovies } from "@/lib/api";
import SearchInput from "./components/search-input";
// import { Movie } from "@/lib/api";
interface Movie {
  image_url: string;
  genre: string;
  id: string;
  release_date: string;
  title: string;
}

const SearchPage: React.FC = () => {

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || ""; // Get the query parameter from the URL
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    // Fetch data from the backend
    fetch(`http://localhost:5002/search/${encodeURIComponent(query)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch movies");
        return response.json();
      })
      .then((data) => setResults(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Results for "{query}"</h1>
      {results.map((movie) => (
          <li key={movie.imdbID} className="mb-4">
            <img
              src={movie.image_url !== "N/A" ? movie.image_url : "/placeholder.png"}
              alt={movie.title}
              className="w-full h-64 object-cover mb-2 rounded"
            />
            <h2 className="text-lg font-bold">{movie.title}</h2>
            <p>{movie.created_at}</p>
          </li>
        ))}
     
    </div>
  );
};

export default SearchPage;