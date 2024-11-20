"use client";

import SearchInput from "./search/components/search-input";

export default function Home() {
	return (
		<div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
			<div className="w-full max-w-md text-center">
				<h1 className="text-4xl font-bold text-teal-700 dark:text-teal-300 mb-4">
					🎬 Welcome to Film Owl
				</h1>
				<p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
					Your one-stop destination to discover, rate, and love movies
					worth a hoot! Search for your favorite films and build your
					ultimate watchlist today.
				</p>
				<SearchInput />
			</div>
		</div>
	);
}
