"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { authContext, useAuth } from "@/Context/Auth";

export default function Navbar() {
	const router = useRouter();
	const { user } = useAuth();

	return (
		<nav className="sticky top-0 z-50">
			<nav className="blue border-gray-200 ">
				<div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
					<a
						href="https://flowbite.com"
						className="flex items-center space-x-3 rtl:space-x-reverse">
						<img
							src="https://flowbite.com/docs/images/logo.svg"
							className="h-8"
							alt="Flowbite Logo"
						/>
						<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
							COSMIC
						</span>
					</a>
					<div class="relative "></div>
					<div className="flex items-center space-x-6 rtl:space-x-reverse">
						{!user ? (
							<Link href="/Signin">
								<div class="text-gray-900 light hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 hover:text-white">
									Sing In
								</div>
							</Link>
						) : (
							<div></div>
						)}
						{user ? (
							<Link href="/Account">
								<img
									className="h-12 w-12 rounded-full"
									src="https://placehold.co/96x96"
									alt=""
								/>
							</Link>
						) : (
							<div></div>
						)}
					</div>
				</div>
			</nav>
			<nav className="light text-gray-900">
				<div className="max-w-screen-xl px-4 py-3 mx-auto">
					<div className="flex items-center">
						<ul className="flex flex-row font-medium mt-0 space-x-12 rtl:space-x-reverse text-md">
							<li>
								<Link
									href="/"
									className="text-gray-900  hover:underline"
									aria-current="page">
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/Services"
									className="text-gray-900  hover:underline">
									Services
								</Link>
							</li>
							<li>
								<a href="#" className="text-gray-900  hover:underline">
									Activity
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-900  hover:underline">
									Contact Us
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</nav>
	);
}
