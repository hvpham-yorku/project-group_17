"use client"

import { Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage: React.FC = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {

		const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (trimmedEmail && trimmedPassword) {
			
            const loginCredentials = {
                email: trimmedEmail,
                password: trimmedPassword,
            };

            try {

                const response = await fetch("http://localhost:5001/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(loginCredentials),
                });

                const data = await response.json();

                if (response.ok) {

                    const user = {
                        username: data.username,
                        email: trimmedEmail,
                        token: data.token
                    }

                    router.push("/");

                    localStorage.setItem("user", JSON.stringify(user));
                    window.location.reload();
                } else {
                    setError(data.detail || "Invalid email or password");
                }
            } catch (error) {
                setError("An error occurred while logging in");
                console.error("Login error:", error);
            }
            
		}
	};

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleLogin();
		}
	};

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
            <div className="text-4xl font-bold text-teal-700 dark:text-teal-300 mb-14">
                <h4>User LogIn</h4>
            </div>

            {error && <p className="text-red-500 mb-8">{error}</p>}

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
            
            <button type="button" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700" onClick={handleLogin}>
                Submit
            </button>
        </div>
    );

}

export default LoginPage;