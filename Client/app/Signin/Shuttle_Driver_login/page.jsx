"use client";

import { useSignup } from "@/Context/Signup";
import Link from "next/link";
import React from "react";

export default function page() {
	const { googleLogin } = useSignup();

	const Login = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());

		googleLogin(data, "Shuttle");
	};

	return (
		<div className="my-10">
			<div className="flex justify-center my-10 text-6xl font-bold">
				<h1>Log In</h1>
			</div>
			<form class="max-w-sm mx-auto blue  p-10 rounded-xl" onSubmit={Login}>
				<div class="mb-5">
					<label
						for="email"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Your email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
						required
					/>
				</div>
				<div class="mb-5">
					<label
						for="password"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Your password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
						required
					/>
				</div>

				<div className="flex justify-center">
					<button
						type="submit"
						class="text-white revbut font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">
						Log in
					</button>
				</div>
			</form>

			<div className="mt-5 flex justify-center font-bold hover:underline">
				<Link href="/Signin/Shuttle_Driver_Registration ">
					Don't have account? Register
				</Link>
			</div>
		</div>
	);
}
