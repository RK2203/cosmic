"use client";

import React, { useEffect, useState } from "react";

import { BiSortAlt2 } from "react-icons/bi";

export default function Shuttle() {
	const [shuttles, setShuttles] = useState([]);
	const [dest, setdest] = useState(null);

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

	const fetchShuttles = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				const loc = {
					lat: position.coords.latitude,
					long: position.coords.longitude,
					time: currentTime,
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
							// 	lat: 22.540668530875582,
							// 	long: 88.33169105928287,
							// 	time: "10:10 AM",
							// }),
							// body: JSON.stringify({
							// 	lat: 22.579348721922962,
							// 	long: 88.46970675308098,
							// 	time:"10:10 AM",
							// }),
						}
					);

					const data = await response.json();

					setShuttles(data);
				} catch (error) {
					console.error("Error fetching shuttle data:", error);
				}
			});
		}
	};

	const fetchSearch = async (e) => {
		e.preventDefault();

		const fromData = new FormData(e.target);

		const data = Object.fromEntries(fromData.entries());

		await fetch("http://localhost:8000/Shuttles/search", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				start: data.start,
				dest: data.dest,
				time: "3:00 PM",
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				setdest(data.dest);
				setShuttles(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		fetchShuttles();
	}, []);

	return (
		<div>
			<form className="max-w-sm mx-auto mt-20" onSubmit={fetchSearch}>
				<div className="mb-5">
					<input
						type="text"
						id="from"
						name="start"
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
						name="dest"
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
						{!dest ? (
							<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
								Drops at {item.Data.Destination} @ {item.ArrivalTime}
							</p>
						) : (
							<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
								Drops at {dest} @ {item.ArrivalTime}
							</p>
						)}
						<p className="font-bold text-white">Rs {item.Data.Fare}/-</p>
					</div>
				))}
			</div>
		</div>
	);
}
