"use client";

import React, { useEffect, useState } from "react";

import { BiSortAlt2 } from "react-icons/bi";

export default function Shuttle() {
	const [shuttles, setShuttles] = useState([]);

	function timeToMinutes(timeStr) {
		if (!timeStr) return 0;

		const timeParts = timeStr.split(/[.:]/);
		let hours = parseInt(timeParts[0]);
		let minutes = parseInt(timeParts[1]);
		const modifier = timeParts[2];

		if (isNaN(hours) || isNaN(minutes)) {
			return 0;
		}

		if (modifier === "PM" && hours !== 12) hours += 12;
		if (modifier === "AM" && hours === 12) hours = 0;

		return hours * 60 + minutes;
	}

	function getCurrentTime() {
		const now = new Date();
		let hours = now.getHours();
		const minutes = now.getMinutes();
		const modifier = hours >= 12 ? "PM" : "AM";
		hours = hours % 12 || 12;
		const formattedTime = `${hours}:${minutes
			.toString()
			.padStart(2, "0")} ${modifier}`;
		return formattedTime;
	}

	const currentTime = getCurrentTime();
	const currentMinutes = timeToMinutes(currentTime);

	const morningStart = timeToMinutes("10.00 AM");
	const morningEnd = timeToMinutes("1.00 PM");
	const eveningStart = timeToMinutes("3.00 PM");
	const eveningEnd = timeToMinutes("8.00 PM");

	function isWithinRange(time, start, end) {
		return time >= start && time <= end;
	}

	const fetchShuttles = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				const loc = {
					lat: position.coords.latitude,
					long: position.coords.longitude,
				};

				try {
					const response = await fetch(
						"http://localhost:8000/Shuttles/getspot",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(loc),
							// body: JSON.stringify({
							// 	lat: 22.57481149046102,
							// 	long: 88.46586582831961,
							// // }),
							// body: JSON.stringify({
							// 	lat: 22.579348721922962,
							// 	long:  88.46970675308098
							// }),
						}
					);

					if (!response.ok) {
						throw new Error("Failed to fetch shuttle data.");
					}

					const data = await response.json();

					const filteredData = await data.filter((item) => {
						const itemTime = timeToMinutes(item.Time);

						if (
							isWithinRange(currentMinutes, morningStart, morningEnd) &&
							isWithinRange(itemTime, morningStart, morningEnd)
						) {
							return (
								currentMinutes <= itemTime && item.Data.Starting == item.Name
							);
						}
						if (
							isWithinRange(currentMinutes, eveningStart, eveningEnd) &&
							isWithinRange(itemTime, eveningStart, eveningEnd)
						) {
							return (
								currentMinutes <= itemTime && item.Data.Starting == item.Name
							);
						}
					});

					setShuttles(filteredData);
				} catch (error) {
					console.error("Error fetching shuttle data:", error);
				}
			});
		}
	};

	useEffect(() => {
		fetchShuttles();
	}, []);

	return (
		<div>
			<form className="max-w-sm mx-auto mt-20">
				<div className="mb-5">
					<input
						type="text"
						id="from"
						className="light border border-gray-900 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						placeholder="From"
						required
					/>
				</div>
				<div className="flex justify-end text-xl mb-5 ">
					<BiSortAlt2 className="border-black border-2 rounded-full font-bold" />
				</div>
				<div className="mb-5">
					<input
						type="text"
						id="to"
						className="light border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
						placeholder="Destination"
						required
					/>
				</div>
				<div className="flex justify-center">
					<button
						type="submit"
						className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
						Search
					</button>
				</div>
			</form>

			{/* Display filtered shuttles */}
			<div className="grid grid-cols-3 gap-5 mx-10 my-10">
				{shuttles.map((item, index) => (
					<div
						key={index}
						className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
						<div className="flex justify-between">
							<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								{item.Data.Starting} → {item.Data.Destination}
							</h5>
							<p className="text-white font-bold">{item.Data.Code}</p>
						</div>
						<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
							Pick up at {item.Name} @ {item.Time}
						</p>
						<p className="font-bold text-white">Rs {item.Data.Fare}/-</p>
					</div>
				))}
			</div>
		</div>
	);
}
