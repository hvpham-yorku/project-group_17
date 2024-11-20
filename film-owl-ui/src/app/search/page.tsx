"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Movie {
	image_url: string;
	genre: string;
	id: string;
	release_date: string;
	title: string;
	created_at: string;
	imdbID: string;
}
const SearchPage: React.FC = () => {
	const searchParams = useSearchParams();
	const query = searchParams.get("query") || "";
	const [results, setResults] = useState<Movie[]>([]);

	useEffect(() => {
		if (!query) return;

		// Fetch data from the backend
		fetch(`http://localhost:5002/search/${encodeURIComponent(query)}`)
			.then((response) => {
				if (!response.ok) throw new Error("Failed to fetch movies");
				return response.json();
			})
			.then((data) => {
				if (!query) return;
				setResults(data);
			})
			.catch((error) => console.error("Error fetching movies:", error));
	}, [query]);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8">Results for "{query}"</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{results.map((movie) => (
					<a
						key={movie.id}
						href={`/movie/${movie.id}`}
						className="mb-4 block"
					>
						<img
							src={
								movie.image_url !== "N/A"
									? movie.image_url
									: "/placeholder.png"
							}
							alt={movie.title}
							className="w-full h-447 object-cover mb-2 rounded"
						/>
						<h2 className="text-lg font-bold">{movie.title}</h2>
					</a>
				))}
			</div>
		</div>
	);
};

export default SearchPage;
