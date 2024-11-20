"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Movie } from "../../models/movie";
const MoviePage: React.FC = () => {
	const { id } = useParams();
	const [movie, setMovie] = useState<Movie | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col md:flex-row items-center">
				<Image
					src={movie.image_url}
					alt={movie.title}
					className="w-full md:w-1/3 rounded-lg shadow-lg mb-4 md:mb-0"
					width={500}
					height={750}
				/>
				<div className="md:ml-8">
					<h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
					<p className="text-gray-700 mb-4">{movie.plot}</p>
					<p className="text-sm text-gray-500">
						<strong>Release Date:</strong> {movie.release_date}
					</p>
				</div>
			</div>
		</div>
	);
};

export default MoviePage;
