"use client";

import { authContext } from "@/Context/Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

export default function page() {
	const { user, loading, role } = useContext(authContext);
	const router = useRouter();

	return (
		<div className="flex justify-evenly mt-20">
			<div class="max-w-sm p-6 e border border-gray-200 rounded-lg shadow blue">
				<a href="#">
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Do you want to ride?
					</h5>
				</a>

				<Link
					href="/Signin/User"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center  revbut rounded-lg ">
					Read more
					<svg
						class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 10">
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 5h12m0 0L9 1m4 4L9 9"
						/>
					</svg>
				</Link>
			</div>

			<div class="max-w-sm p-6 blue border border-gray-200 rounded-lg shadow ">
				<a href="#">
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Do you want to drive?
					</h5>
				</a>

				<Link
					href="/Signin/Driver"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center revbut rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300">
					Read more
					<svg
						class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 10">
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 5h12m0 0L9 1m4 4L9 9"
						/>
					</svg>
				</Link>
			</div>
		</div>
	);
}
