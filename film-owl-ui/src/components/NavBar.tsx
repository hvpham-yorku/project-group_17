"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

function NavBar() {

	const [isOpen, setIsOpen] = useState(false);
	let user = localStorage.getItem("user");
	const router = useRouter();

	let displayName = "";
	if (user) {
		displayName=JSON.parse(user).email;
	}

	const toggleMenu = () => {
		setIsOpen(!isOpen);
		console.log("Menu toggled:", isOpen);
	};

	const handleLogOut = () => {
		localStorage.clear();
		window.location.reload();
		router.push("/");
	}

	return (
		<nav className="sticky top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				{/* Title */}
				<Link
					href="/"
					className="hidden lg:block text-center text-teal-800 dark:text-teal-300 font-bold text-5xl"
				>
					Film Owl
				</Link>

				{/* Logo */}
				<div className="flex items-center">
					<Link href="/">
						<Image
							src="/logo-dark.png"
							alt="FilmOwl Logo"
							width={1000}
							height={1000}
							className="mr-3 w-8 sm:w-12 md:w-16 lg:w-20"
							style={{ height: "auto" }}
						/>
					</Link>
				</div>

				{/* Nav Links */}
				<div
					className={`${
						isOpen ? "block" : "hidden"
					} lg:flex lg:items-center lg:justify-between w-full lg:w-auto mt-4 lg:mt-0`}
				>
					<div className="text-xl lg:flex-grow">
						<Link
							href="/"
							className="block lg:inline-block text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline dark:hover:underline mx-4"
						>
							Home
						</Link>
						
						{
							user &&

							<Link
								href="/favourites"
								className="block lg:inline-block text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline dark:hover:underlinemx-4"
							>
								Favourites
							</Link>
						}


						{/* <Link
							href="/ratings"
							className="block lg:inline-block text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline dark:hover:underline mx-4"
						>
							Ratings
						</Link> */}
						{
							!user &&

							<Link
								href="/login"
								className="block lg:inline-block text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline dark:hover:underline mx-4"
						>
								Login
							</Link>
						}
						{
							!user &&

							<Link
								href="/signup"
								className="block lg:inline-block text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline dark:hover:underline mx-4"
						>
								SignUp
							</Link>
						}
						{
							user &&

							<p className="block lg:inline-block text-teal-800 dark:text-teal-300  mx-4">

								{displayName}
							</p>
						}
						{
							user &&

							<Link 
								href="/" 
								className="block lg:inline-block text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline dark:hover:underline mx-4" onClick={handleLogOut}>
								
								Sign Out
							</Link>
						}
					</div>
				</div>
			</div>
		</nav>
	);
}

export default NavBar;
