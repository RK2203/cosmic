"use client";

import { useSignup } from "@/Context/Signup";
import Link from "next/link";
import React, { useState } from "react";

export default function RegisterPage() {
	const [match, setMatch] = useState(true);
	const { googleSignup } = useSignup();

	const register = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());

		if (data.password !== data.repeat_password) {
			setMatch(false);
			return;
		} else {
			googleSignup(data, "Shuttle");
			setMatch(true);
		}
	};

	return (
		<div className="my-10">
			<div className="flex justify-center my-10 text-6xl font-bold">
				<h1>Register</h1>
			</div>
			<form
				className="max-w-2xl mx-auto blue p-10 rounded-xl"
				onSubmit={register}>
				<div className="flex justify-between">
					<div className="mb-5">
						<label
							htmlFor="firstname"
							className="block mb-2 text-sm font-medium text-white">
							First name
						</label>
						<input
							type="text"
							name="firstname"
							id="firstname"
							className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							required
						/>
					</div>
					<div className="mb-5">
						<label
							htmlFor="lastname"
							className="block mb-2 text-sm font-medium text-white">
							Last Name
						</label>
						<input
							type="text"
							name="lastname"
							id="lastname"
							className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							required
						/>
					</div>
				</div>
				<div className="flex justify-between">
					<div className="mb-5">
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-white">
							Your email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							placeholder="name@flowbite.com"
							required
						/>
					</div>
					<div className="mb-5">
						<label
							htmlFor="phone"
							className="block mb-2 text-sm font-medium text-white">
							Your phone number
						</label>
						<input
							type="text"
							name="phone"
							id="phone"
							className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							placeholder="xxx-yyy-zzz"
							required
						/>
					</div>
				</div>
				<div className="flex justify-between">
					<div className="mb-5">
						<label
							htmlFor="dob"
							className="block mb-2 text-sm font-medium text-white">
							Date of birth
						</label>
						<input
							type="date"
							name="dob"
							id="dob"
							className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							required
						/>
					</div>
					<div className="mb-5">
						<label
							htmlFor="car"
							className="block mb-2 text-sm font-medium text-white">
							Your vehicle number
						</label>
						<input
							type="text"
							name="car"
							id="car"
							className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							placeholder="xxyyzz"
							required
						/>
					</div>
				</div>
				<div className="flex justify-between">
					<div className="mb-5">
						<label
							htmlFor="password"
							className="block mb-2 text-sm font-medium text-white">
							Your password
						</label>
						<input
							type="password"
							name="password"
							id="password"
							className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
							required
						/>
					</div>
					<div className="mb-5">
						<label
							htmlFor="repeat-password"
							className={`block mb-2 text-sm font-medium ${
								match ? "text-white" : "text-red-700"
							}`}>
							{match && <p>Repeat password</p>}
							{!match && <p>Paswword does not match</p>}
						</label>
						<input
							type="password"
							name="repeat_password"
							id="repeat-password"
							className={`shadow-sm bg-gray-50 border ${
								match ? "border-gray-300" : "border-red-700 border-4"
							} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
							required
						/>
					</div>
				</div>
				<div className="flex justify-center flex-col">
					<div className="flex justify-center items-start mb-5">
						<div className="flex items-center h-5">
							<input
								id="terms"
								type="checkbox"
								name="terms"
								className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
								required
							/>
						</div>
						<label
							htmlFor="terms"
							className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
							I agree with the{" "}
							<a href="#" className="hover:underline text-white">
								terms and conditions
							</a>
						</label>
					</div>
					<div className="flex justify-center">
						<button
							type="submit"
							className="text-white revbut font-medium rounded-lg text-sm px-5 py-2.5 text-center">
							Register new account
						</button>
					</div>
				</div>
			</form>
			<div className="mt-5 flex justify-center font-bold hover:underline">
				<Link href="/Signin/Shuttle_Driver_login">Have an account? Log in</Link>
			</div>
		</div>
	);
}
