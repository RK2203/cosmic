"use client";

import { useApolloClients } from "@/Context/Apollo";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense, useMemo } from "react";
import { motion } from "framer-motion";

import { BiSortAlt2 } from "react-icons/bi";

const query = gql`
	query test($lat: Float!, $long: Float!) {
		getShuttle(Lat: $lat, Long: $long) {
			Starting
			Destination
		}
	}
`;

export default function Shuttle() {
	const [shuttles, setShuttles] = useState([]);

	const { client2 } = useApolloClients();

	const [getShuttle] = useLazyQuery(query, { client: client2 });

	const [start, setStart] = useState("From");
	const [dest, setDest] = useState("To");

	const router = useRouter();

	const search = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());

		const time = "10:00 AM";

		const details = {
			start: data.start,
			dest: data.dest,
			time,
		};

		const params = new URLSearchParams(details).toString();
		router.push(`/Services/Shuttle/Search_Results?${params}`);
	};
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

	// Swapping
	const startChange = (e) => {
		setStart(e.target.value);
	};
	const destChange = (e) => {
		setDest(e.target.value);
	};

	const startfocus = () => {
		setStart("");
	};
	const destfocus = () => {
		setDest("");
	};

	function swapper() {
		setStart(dest);
		setDest(start);
	}

	// Fetching routes

	const fetchShuttles = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async (position) => {
				const lat = position.coords.latitude;
				const long = position.coords.longitude;

				try {
					const res = await getShuttle({
						variables: {
							lat,
							long,
						},
					});

					setShuttles(res.data.getShuttle);
				} catch (error) {
					console.error("Error fetching shuttle data:", error);
				}
			});
		}
	};

	// Fetching search

	const fetchSearch = async (e) => {
		e.preventDefault();

		const fromData = new FormData(e.target);

		const data = Object.fromEntries(fromData.entries());
	};

	useEffect(() => {
		fetchShuttles();
	}, []);

	const memoizedData = useMemo(() => {
		return shuttles.map((item, index) => (
			<Suspense
				fallback={<p className="text-black">Loading.....</p>}
				key={index}>
				<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow blue  cursor-pointer">
					<div className="flex justify-between">
						<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							{item.Starting} → {item.Destination}
						</h5>
					</div>

					<p className="font-bold text-white">Nearest pickup : .....</p>
				</div>
			</Suspense>
		));
	}, [shuttles]);

	return (
		<div>
			<form className="max-w-sm mx-auto mt-20" onSubmit={search}>
				<div className="mb-5">
					<input
						type="text"
						id="from"
						name="start"
						className="light  text-gray-900 text-sm rounded-lg  block w-full p-2.5"
						value={start}
						onFocus={startfocus}
						onChange={startChange}
						required
					/>
				</div>
				<div className="flex justify-end text-xl mb-5 ">
					<motion.div whileTap={{ rotate: 180 }} transition={{ duration: 0.1 }}>
						<BiSortAlt2
							className="border-black border-2 rounded-full font-bold"
							onClick={swapper}
						/>
					</motion.div>
				</div>
				<div className="mb-5">
					<input
						type="text"
						id="to"
						name="dest"
						className="light  text-gray-900 text-sm rounded-lg  block w-full p-2.5 "
						value={dest}
						onFocus={destfocus}
						onChange={destChange}
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
			<div className="grid grid-cols-3 gap-5 mx-10 my-10">{memoizedData}</div>
		</div>
	);
}
