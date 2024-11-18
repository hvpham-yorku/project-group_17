import Image from "next/image";
import FilmOwlNav from "./navbar";
import SearchInput from "./search-input";

export default function App() {
	return (
		<div>
			<FilmOwlNav />
			<main className="flex flex-col gap-8 row-start-2 items-center h-screen">
				<Image
					src={"/logo.png"}
					width={300}
					height={300}
					alt="Film Owl Logo"
				/>
				<h1 className="text-4xl font-bold text-center">
					Welcome to Film Owl
				</h1>
				<p className="text-xl text-center">
					The best place to find all the latest movies and TV shows
				</p>
				<SearchInput />
			</main>
			<footer className="flex justify-center gap-4"></footer>
		</div>
	);
}
