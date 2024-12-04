"use client";

import React, { useEffect, useState } from "react";
import { Movie } from "../models/movie";
import { User } from "../models/user";

const FavouritesPage: React.FC = () => {
	let user: User = localStorage.getItem("user")
		? JSON.parse(localStorage.getItem("user") || "null")
		: { username: "Guest", favourites: [] };
	const [results, setResults] = useState<Movie[]>([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState<boolean>(false);
	const displayName = user.username;

	useEffect(() => {
		const fetchfavourites = async () => {
			try {
				if (user) {
					const favoriteIds = user.favourites || [];
					const favoriteMovies: Movie[] = [];

					for (const id of favoriteIds) {
						const response = await fetch(
							`http://localhost:5002/movies/${id}`
						);
						const movie = await response.json();
						favoriteMovies.push(movie);
					}

					setResults(favoriteMovies);
				}
			} catch (error) {
				console.error(
					"Error fetching favourites from localStorage:",
					error
				);
				setError("Failed to fetch favorite movies.");
			} finally {
				setLoading(false);
			}
		};

		setLoading(true);
		fetchfavourites();
	}, [displayName]);

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
				<p className="text-lg font-semibold text-red-500">{error}</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-4">
			<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
				{displayName}'s Favourites
			</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{results.map((movie) => (
					<div
						key={movie.id}
						className="flex flex-col items-center justify-center"
					>
						<img
							src={movie.image_url}
							alt={movie.title}
							className="w-40 h-60 object-cover rounded-lg"
						/>
						<p className="text-center text-sm mt-2">
							{movie.title}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default FavouritesPage;
