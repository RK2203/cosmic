"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function page({ params }) {
	const param = useSearchParams();

	return (
		<div class="w-3/4 p-4  bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700 my-20 mx-20">
			<div className="flex justify-center">
				<h2 class="text-center text-gray-200 whitespace-pre-line mb-4 text-4xl">Shuttle No {params.card}</h2>
			</div>
			<h2 class="text-lg text-gray-200 font-medium mt-4 ml-5">Here is Your Trip details</h2>

			<div class="space-y-2">
				<div div class="flex items-center ml-6">
					<div class="w-2 h-2 bg-white rounded-se-sm mr-2"></div>
					<span className="m-3 text-gray-200">25.31 kilometers</span>
					<div class="w-2 h-2 bg-white rounded-se-sm mr-2"></div>
					<span className="m-3 text-gray-200 ">1 h 28 min</span>
				</div>

				<div class="flex items-center ml-6">
				<span className="m-3 text-gray-200 ">FARE : -</span>
				<span className="text-gray-200">₹{param.get("fare")}</span>
				</div>
			</div>
			<h2 class="text-xl font-medium mb-4 ml-4 pt-3 text-gray-200">Route</h2>
			<div class="space-y-4">
				<div class="flex justify-between items-start">
					<div class="flex items-center">
						<div class="w-4 h-4 bg-primary rounded-full mr-2"></div>
						<span className="text-gray-200">{param.get("start")} Ride Start At : </span>
						<span className="m-3 text-gray-200"> {param.get("startTime")}</span>
					</div>
				</div>
				<div class="flex justify-between items-start">
					<div class="flex items-center">
						<div class="w-4 h-4 bg-primary rounded-full mr-2"></div>
						<span className="text-gray-200">{param.get("dest")} Ride end At:</span>
						<span className="m-3 text-gray-200"> {param.get("destTime")}</span>
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
