// "use client";
import { Input } from "@nextui-org/react";
import { SearchCodeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchInput: React.FC = () => {
	const [query, setQuery] = useState("");
	const router = useRouter();

	const handleSearch = () => {
		const trimmedQuery = query.trim();
		if (trimmedQuery) {
			router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
		}
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div className="flex items-center border border-gray-300 rounded-md p-2">
			<SearchCodeIcon className="text-black/50 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
			<Input
				placeholder="Type a movie name here..."
				type="search"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={handleKeyPress}
				className="w-full bg-transparent outline-none text-teal-600 font-bold dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-300"
				style={{ height: "2rem", paddingLeft: "1rem" }}
			/>
			<button
				onClick={handleSearch}
				className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-3 rounded-r-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-300"
			>
				Search
			</button>
		</div>
	);
};

export default SearchInput;
