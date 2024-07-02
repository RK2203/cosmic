'use client'

import { useRouter } from "next/navigation";
import React from "react";

export default function page({params}) {
	const router = useRouter();


	console.log(router);
	
	console.log(params);


	return (
		<div class="p-6 bg-card text-card-foreground rounded-lg shadow-md relative my-20 light mx-20">
			<h2 class="text-lg font-semibold mb-4">Trip details</h2>
			<div class="space-y-2">
				<div class="flex items-center ml-6">
					<div class="w-2 h-2 bg-black rounded-full mr-2"></div>
					<span>25.31 kilometers</span>
				</div>
				<div class="flex items-center ml-6">
					<div class="w-2 h-2 bg-black rounded-full mr-2"></div>
					<span>1 h 28 min</span>
				</div>
				<div class="flex items-center ml-6">
					<div class="w-2 h-2 bg-black rounded-full mr-2"></div>
					<span>₹0.00</span>
				</div>
			</div>
			<hr class="my-6 border-muted" />
			<h2 class="text-lg font-semibold mb-4">Route</h2>
			<div class="space-y-4">
				<div class="flex justify-between items-start">
					<div class="flex items-center">
						<div class="w-4 h-4 bg-primary rounded-full mr-2"></div>
						<span>
							Street Number 372, CC Block(Newtown), AA II, Newtown, New Town,
							West Bengal 700135, India
						</span>
					</div>
					<span>5:58 PM</span>
				</div>
				<div class="flex justify-between items-start">
					<div class="flex items-center">
						<div class="w-4 h-4 bg-primary rounded-full mr-2"></div>
						<span>Danesh Sheikh Lane, Howrah, West Bengal, India</span>
					</div>
					<span>7:27 PM</span>
				</div>
				<h2 class="text-lg font-semibold mb-4">Payment methods</h2>
				<div class="space-y-2">
					<div class="flex items-center">
						<input
							type="checkbox"
							id="debit-card"
							name="payment-method"
							class="h-4 w-4 mr-2 cursor-pointer"
						/>
						<label for="debit-card">Debit Card</label>
					</div>
					<div class="flex items-center">
						<input
							type="checkbox"
							id="upi"
							name="payment-method"
							class="h-4 w-4 mr-2 cursor-pointer"
						/>
						<label for="upi">UPI</label>
					</div>
				</div>
			</div>
			<div className="flex justify-center mt-10">
				<button class="bg-primary  text-primary-foreground rounded-full py-2 px-6 hover:bg-[#6969e8]  blue text-white">
					Book Now
				</button>
			</div>
		</div>
	);
}
