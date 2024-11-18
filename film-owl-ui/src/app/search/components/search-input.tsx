"use client";
import { Input } from "@nextui-org/react";
import React, { useState } from "react";
import {SearchIcon} from "./SearchIcon";

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
    <div className="flex items-center border border-gray-300 rounded-md p-2">
      <SearchIcon className="text-black/50 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
      <Input
        placeholder="Type a movie name here..."
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className="ml-2 flex-grow bg-transparent outline-none dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-300"
        style={{ height: '100%' }}
      />
      <button
        onClick={handleSearch}
        className= "bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-3 rounded-r-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-300"
      >
        Search
      </button>
    </div>
  );
};

export default SearchInput;