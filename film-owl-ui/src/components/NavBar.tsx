'use client';

import React, { useState } from 'react';
import Image from 'next/image'; // For Next.js Image optimization
import Link from 'next/link';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    console.log('Menu toggled:', isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* Title */}
        <div className="hidden lg:block text-center text-teal-800 dark:text-teal-300 font-bold text-5xl">
          Film Owl
        </div>

        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo-dark.png"
            alt="FilmOwl Logo"
            width={0}
            height={0}
            className="mr-3 w-8 sm:w-12 md:w-16 lg:w-20"
            style={{ height: 'auto' }}
          />
        </div>

        {/* Hamburger Icon */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="flex items-center px-3 py-2 text-teal-700 dark:text-teal-300"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <div
          className={`${isOpen ? 'block' : 'hidden'
            } lg:flex lg:items-center lg:justify-between w-full lg:w-auto mt-4 lg:mt-0`}
        >
          <div className="text-xl lg:flex-grow">
            <Link href="/" className="block lg:inline-block text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline dark:hover:underline mx-4">
              Home
            </Link>
            <Link href="/favourites" className="block lg:inline-block text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline dark:hover:underlinemx-4">
              Favourites
            </Link>
            <Link href="/ratings" className="block lg:inline-block text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline dark:hover:underline mx-4">
              Ratings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
