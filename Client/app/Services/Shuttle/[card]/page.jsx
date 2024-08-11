"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function page({ params }) {
	const param = useSearchParams();

	return (
		<div class="p-6 bg-card w-5/6 text-card-foreground rounded-lg shadow-md relative my-20 bg-gradient-radial from-gray-900 to-white  mx-20">
			<div className="flex justify-center">
				<h2 class="text-center text-gray-950 whitespace-pre-line dark:text-gray-900 mb-4 text-4xl">Shuttle No {params.card}</h2>
			</div>
			<h2 class="text-lg font-semibold mt-4 ml-5">Here is Your Trip details</h2>

			<div class="space-y-2">
				<div div class="flex items-center ml-6">
					<div class="w-2 h-2 bg-black rounded-full mr-2"></div>
					<span className="m-3">25.31 kilometers</span>
					<div class="w-2 h-2 bg-black rounded-full mr-2"></div>
					<span className="m-3 ">1 h 28 min</span>
				</div>

				<div class="flex items-center ml-6">
				<span className="m-3">FARE : -</span>
				<span>₹{param.get("fare")}</span>
				</div>
			</div>
			<h2 class="text-xl font-semibold mb-4 ml-4 pt-3">Route</h2>
			<div class="space-y-4">
				<div class="flex justify-between items-start">
					<div class="flex items-center">
						<div class="w-4 h-4 bg-primary rounded-full mr-2"></div>
						<span>{param.get("start")} Ride Start At : </span>
						<span className="m-3"> {param.get("startTime")}</span>
					</div>
				</div>
				<div class="flex justify-between items-start">
					<div class="flex items-center">
						<div class="w-4 h-4 bg-primary rounded-full mr-2"></div>
						<span>{param.get("dest")} Ride end At:</span>
						<span className="m-3"> {param.get("destTime")}</span>
					</div>

				</div>
				
			</div>
			<div className="flex justify-center mt-10">
				<button type="button" class="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2">
					BOOK YOUR RIDE
				</button>
			</div>
		</div>
	);
}
