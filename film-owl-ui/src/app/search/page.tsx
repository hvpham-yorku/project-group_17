"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Movie } from "../models/movie";

const SearchPage: React.FC = () => {
	const searchParams = useSearchParams();
	const query = searchParams.get("query") || "";
	const [results, setResults] = useState<Movie[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');


	useEffect(() => {
		if (!query) return;

		setLoading(true);
    setError('');

		// Fetch data from the backend
		fetch(`http://localhost:5002/search/${encodeURIComponent(query)}`)
			.then((response) => {
				if (!response.ok) throw new Error("Failed to fetch movies");
				return response.json();
			})
			.then((data) => {
				if (!query) return;
        if (data.Error) {
          setError(data.Error);
        } else {
         setResults(data);
        }
			})
			.catch((error) => {
        console.error("Error fetching movies:", error)
        setError('An error occurred while fetching movies.');
  })
			.finally(() => setLoading(false));
	}, [query]);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8">Results for "{query}"</h1>
			{loading ? (
				<div className="text-center text-teal-500">Loading...</div>
			) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
					{results.map((movie) => (
						<Link
							key={movie.id}
							href={`/movie/${movie.id}`}
							className="mb-4 block"
						>
							<Image
								src={movie.image_url}
								alt={movie.title}
								className="rounded-lg shadow-md mb-4 md:mb-0 hover:shadow-2xl transition-transform duration-300"
								height={450}
								width={300}
							/>
							<h2 className="text-lg font-bold">{movie.title}</h2>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default SearchPage;
