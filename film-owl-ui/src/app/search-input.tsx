"use client";
import { Input } from "@nextui-org/react";
import React, { useState } from "react";

const SearchInput: React.FC = () => {
	const [query, setQuery] = useState("");

	const handleSearch = async () => {
		if (!query.trim()) return;

		const endpoint = `http://localhost:5000/search/${encodeURIComponent(
			query
		)}`;
		try {
			const response = await fetch(endpoint);
			if (!response.ok) throw new Error(`Error: ${response.statusText}`);
			const data = await response.json();
			console.log("Search Results:", data);
		} catch (error) {
			console.error("Search Error:", error);
		}
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<Input
			placeholder="Type to search..."
			size="sm"
			type="search"
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			onKeyPress={handleKeyPress}
			classNames={{
				base: "max-w-full sm:max-w-[10rem] h-10",
				mainWrapper: "h-10",
				input: "h-full text-small",
				inputWrapper:
					"h-full flex items-center font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
			}}
		/>
	);
};

export default SearchInput;
