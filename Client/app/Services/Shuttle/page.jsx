import React from "react";
import { BiSortAlt2 } from "react-icons/bi";

export default function shuttle() {
	return (
		<div>
			<form class="max-w-sm mx-auto mt-20">
				<div class="mb-5">
					<input
						type="text"
						id="from"
						class="light border border-gray-900 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						placeholder=""
						required
					/>
				</div>
				<div className="flex justify-end text-xl mb-5 ">
					<BiSortAlt2 className="border-black border-2 rounded-full font-bold" />
				</div>
				<div class="mb-5">
					<input
						type="text"
						id="to"
						class="light border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
						placeholder="destination"
						required
					/>
				</div>
				<div className="flex justify-center">
					<button
						type="submit"
						class="text-white blue bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
						Search
					</button>
				</div>
			</form>

			{/* Routes */}

			<div
				class="flex justify-evenly w-full mt-20 mb-10 rounded-md shadow-sm"
				role="group">
				<button
					type="button"
					class="px-4 py-2 text-sm light font-medium text-gray-900 bg-white border border-gray-200 rounded-2xl hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ">
					Today
				</button>
				<button
					type="button"
					class="px-4 py-2 text-sm font-medium light text-gray-900 bg-white border-t border-b border-gray-200 rounded-2xl hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ">
					Tomorrow
				</button>
			</div>

			<div className="flex flex-grow mx-10 my-10 space-x-5">
				<div class="max-w-sm p-6  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
					<div className="flex justify-end ">
						<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							Mandirtala → New Town
						</h5>
						<p className="text-white font-bold"> MN-1004</p>
					</div>
					<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
						Pick up at 10.30am
					</p>
					<p class=" font-bold  text-white ">Rs 100 /-</p>
				</div>
			</div>
		</div>
	);
}
