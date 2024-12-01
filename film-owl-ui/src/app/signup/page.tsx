"use client"

import { Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SignUpPage: React.FC = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignIn = async () => {

        const trimmedUsername = username.trim();
		const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (trimmedEmail && trimmedPassword && trimmedUsername) {
			
            const loginCredentials = {
                username: trimmedUsername,
                email: trimmedEmail,
                password: trimmedPassword,
            };

            try {

                const response = await fetch("http://localhost:5001/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(loginCredentials),
                });

                const data = await response.json();

                if (response.ok) {
                    router.push("/login");
                } else {
                    setError(data.detail || "An error occured when signing up");
                }
            } catch (error) {
                //router.push("/favourites");
                setError("An error occured when signing up");
                console.error("Login error:", error);
            }
            
		}
        else {
            setError("Fill in the required fields");
        }
	};

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSignIn();
		}
	};

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
            <div className="text-4xl font-bold text-teal-700 dark:text-teal-300 mb-12">
                <h4>User SignUp</h4>
            </div>

            {error && <p className="text-red-500 mb-8">{error}</p>}

            <div className="flex items-center border border-gray-300 rounded-md p-2 mb-4">
                <Input
				placeholder="Enter Usename"
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				onKeyDown={handleKeyPress}
				className="w-full bg-transparent outline-none text-teal-600 font-bold dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-300"
				style={{ height: "2rem", paddingLeft: "1rem" }}
			/>
            </div>
            <div className="flex items-center border border-gray-300 rounded-md p-2 mb-4">
                <Input
				placeholder="Enter Email"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				onKeyDown={handleKeyPress}
				className="w-full bg-transparent outline-none text-teal-600 font-bold dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-300"
				style={{ height: "2rem", paddingLeft: "1rem" }}
			/>
            </div>
            <div className="flex items-center border border-gray-300 rounded-md p-2 mb-4">
                <Input
				placeholder="Enter Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				onKeyDown={handleKeyPress}
				className="w-full bg-transparent outline-none text-teal-600 font-bold dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-300"
				style={{ height: "2rem", paddingLeft: "1rem" }}
			/>
            </div>
            
            <button type="button" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700" onClick={handleSignIn}>
                Submit
            </button>
        </div>
    );

}

export default SignUpPage;