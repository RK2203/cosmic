"use client";

import { useApolloClients } from "@/Context/Apollo";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const query = gql`
	query test($start: String!, $dest: String!, $time: String!) {
		getShuttleData(Start: $start, Dest: $dest, Time: $time) {
			Seat
			Fare
			Starting
			Destination
			Shuttle_id
			PickupTime
			DropTime
		}
	}
`;

export default function page() {
	const [days, setDays] = useState([]);

	const param = new useSearchParams();

	const { client2 } = useApolloClients();

	const [getShuttleData] = useLazyQuery(query, { client: client2 });

	const [data, setData] = useState(null);

	const router = useRouter();

	function book(data) {
		const params = new URLSearchParams(data).toString();
		router.push(`/Services/Shuttle/${data.Shuttle_id}?${params}`);
	}

	const getData = async (day) => {
		const res = await getShuttleData({
			variables: {
				start: param.get("start"),
				dest: param.get("dest"),
				time: day == "Today" ? param.get("time") : "00:00 AM",
			},
		});

		console.log(res);

		setData(res.data.getShuttleData);
	};

	function createWeekArray() {
		const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
		const today = new Date().toLocaleString("en-US", { weekday: "long" });

		const todayIndex = daysOfWeek.indexOf(today);
		const weekArray = [];

		if (todayIndex === -1) {
			return daysOfWeek;
		}

		for (let i = todayIndex; i < daysOfWeek.length; i++) {
			if (daysOfWeek[i] === today) {
				weekArray.push("Today");
			} else {
				weekArray.push(daysOfWeek[i]);
			}
		}

		setDays(weekArray);
	}

	useEffect(() => {
		createWeekArray();
		getData("Today");
	}, []);

	return (
		<div>
			<div className="flex justify-center text-6xl font-bold my-10">
				<h1>
					{param.get("start")} to
					{param.get("dest")}
				</h1>
			</div>

			<div className="flex justify-center my-10">
				<div class="inline-flex space-x-10 rounded-md shadow-sm" role="group">
					{days &&
						days.map((item) => {
							return (
								<button
									type="button"
									onClick={() => {
										getData(item);
									}}
									class="px-4 py-2 text-sm font-medium text-gray-900 but bg-white border-t border-b border-gray-200 ">
									{item}
								</button>
							);
						})}
				</div>
			</div>

			<div className="flex ">
				{data &&
					data.map((item) => {
						return (
							<div
								className="flex mx-10 mt-10 text-white"
								onClick={() => {
									book(item);
								}}>
								<div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow blue">
									<div className="flex justify-between">
										<h5 class="mb-2 text-2xl font-bold tracking-tight ">
											{item.Starting} - {item.Destination}
										</h5>
										<h5 class="mb-2 text-xl font-bold tracking-tight ">
											{item.Shuttle_id}
										</h5>
									</div>
									<p class="font-normal te">
										Pick at {param.get("start")} @ {item.PickupTime}
									</p>
									<p class="font-normal te">
										Drops at {param.get("dest")} @ {item.DropTime}
									</p>
									<p class="font-normal te">{item.Fare} Rs/-</p>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}
