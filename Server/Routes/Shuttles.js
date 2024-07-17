import express from "express";
import Shuttles from "../Schemas/Shuttle_schema.js";
import Stopages from "../Schemas/Stopage_schema.js";

const router = express.Router();

router.post("/addShuttles", async (req, res) => {
	try {
		const {
			Code,
			Starting,
			Destination,
			Time_of_deperture,
			Time_of_arrival,
			Passangers,
			Stopages,
			Fare,
			Day,
		} = req.body;

		const shut = new Shuttles({
			Code: Code,
			Starting: Starting,
			Destination: Destination,
			Time_of_deperture: Time_of_deperture,
			Time_of_arrival: Time_of_arrival,
			Passangers: Passangers,
			Stopages: Stopages,
			Fare: Fare,
			Day: Day,
		});

		const savedshut = await shut.save();

		res.json({ msg: "Saved successfully" }).status(200);
	} catch (error) {
		res.json({ Error: error }).status(500);
	}
});

router.get("/getshut", async (req, res) => {
	try {
		const shuts = await Shuttles.find({ Stopages: ["Hastings"] });

		res.json(shuts).status(200);
	} catch (error) {
		res.json({ Error: error }).status(500);
	}
});

router.post("/addSpot", async (req, res) => {
	try {
		const { name, location, shuttles } = req.body;

		const newloc = new Stopages({
			Name: name,
			location: location,
			Shuttles: shuttles,
		});

		await newloc.save();

		res.json({ msg: "Saved" });
	} catch (error) {
		res.json({ error: error });
	}
});

router.post("/getspot", async (req, res) => {
	try {
		const { lat, long, time } = req.body;

		const results = await Stopages.aggregate([
			{
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [lat, long],
					},
					distanceField: "dist.calculated",
					maxDistance: 1000,
					spherical: true,
				},
			},
		]).exec();

		if (!results.length) {
			return res.status(404).json({ message: "No stopages found nearby" });
		}

		const finalData = [];

		// for (const result of results) {
		// 	const stopageName = result.Name;

		// 	const shuttles = result.Shuttles;

		// 	for (const shuttleObj of shuttles) {
		// 		const key = Object.keys(shuttleObj)[0];
		// 		const time = shuttleObj[key];

		// 		const mongoData = await Shuttles.findOne({ Code: key });

		// 		const dest = await Stopages.findOne({ Name: mongoData.Destination });

		// 		const arr = dest.Shuttles;

		// 		const want = arr.find(
		// 			(item) => Object.keys(item)[0] === mongoData.Code
		// 		);

		// 		if (mongoData) {
		// 			const newObj = {
		// 				Name: stopageName,
		// 				Data: mongoData,
		// 				Time: time,
		// 				ArrivalTime: want[mongoData.Code],
		// 			};

		// 			finalData.push(newObj);
		// 		}
		// 	}
		// }

		const shuttleCodes = results.flatMap((result) =>
			result.Shuttles.map((shuttleObj) => Object.keys(shuttleObj)[0])
		);

		const shuttlesPromise = Shuttles.find({ Code: { $in: shuttleCodes } });

		const stopagesPromise = Stopages.find();

		const [shuttlesData, stopagesData] = await Promise.all([
			shuttlesPromise,
			stopagesPromise,
		]);


		for (const result of results) {
			const stopageName = result.Name;
			const shuttles = result.Shuttles;

			for (const shuttleObj of shuttles) {
				const key = Object.keys(shuttleObj)[0];
				const time = shuttleObj[key];

				const mongoData = shuttlesData.find((data) => data.Code === key);
				if (mongoData) {
					const dest = stopagesData.find(
						(stopage) => stopage.Name === mongoData.Destination
					);
					if (dest) {
						const want = dest.Shuttles.find(
							(item) => Object.keys(item)[0] === mongoData.Code
						);
						if (want) {
							const newObj = {
								Name: stopageName,
								Data: mongoData,
								Time: time,
								ArrivalTime: want[mongoData.Code],
							};
							finalData.push(newObj);
						}
					}
				}
			}
		}

		function timeToMinutes(timeStr) {
			if (!timeStr) return 0;

			const normalizedTimeStr = timeStr.replace(".", ":").toUpperCase();

			const [time, modifier] = normalizedTimeStr.split(" ");

			const [hoursStr, minutesStr] = time.split(":");
			let hours = parseInt(hoursStr, 10);
			let minutes = parseInt(minutesStr, 10);

			if (isNaN(hours) || isNaN(minutes)) {
				return 0;
			}

			if (modifier === "PM" && hours !== 12) hours += 12;
			if (modifier === "AM" && hours === 12) hours = 0;

			return hours * 60 + minutes;
		}

		const currentTime = timeToMinutes(time);
		async function filterData(data) {
			const dataWithDistances = await Promise.all(
				data.map(async (item) => {
					const a = await Stopages.findOne({ Name: item.Name });
					const b = await Stopages.findOne({ Name: item.Data.Starting });
					const c = await Stopages.findOne({ Name: item.Data.Destination });

					const lat1 = a.location.coordinates[0];
					const long1 = a.location.coordinates[1];
					const lat2 = b.location.coordinates[0];
					const long2 = b.location.coordinates[1];
					const lat3 = c.location.coordinates[0];
					const long3 = c.location.coordinates[1];

					function calculateDistance(lat1, long1, lat2, long2) {
						const R = 6371e3;
						const φ1 = (lat1 * Math.PI) / 180;
						const φ2 = (lat2 * Math.PI) / 180;
						const Δφ = ((lat2 - lat1) * Math.PI) / 180;
						const Δλ = ((long2 - long1) * Math.PI) / 180;

						const x =
							Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
							Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
						const cc = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

						const d = R * cc;

						return d;
					}

					const spottostart = calculateDistance(lat1, long1, lat2, long2);
					const spottodest = calculateDistance(lat1, long1, lat3, long3);

					let valid = false;

					if (spottostart < spottodest) {
						valid = true;
					}

					const time = timeToMinutes(item.Time);

					return { item, time, valid };
				})
			);

			return dataWithDistances
				.filter(({ time, valid }) => valid && time > currentTime)
				.map(({ item }) => item);
		}

		const filteredData = await filterData(finalData);

		res.json(filteredData);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/search", async (req, res) => {
	try {
		const { start, dest, time } = req.body;

		const startfound = await Stopages.findOne({ Name: start });
		const destfound = await Stopages.findOne({ Name: dest });

		if (!startfound) {
			return res.json({ msg: "No shuttle route found" });
		}
		if (!destfound) {
			return res.json({ msg: "No shuttle route found" });
		}

		async function wrap(data) {
			const finalData = [];

			for (const result of data) {
				const stopageName = result.Name;
				const shuttles = result.Shuttles;

				for (const shuttleObj of shuttles) {
					const key = Object.keys(shuttleObj)[0];
					const time = shuttleObj[key];

					const mongoData = await Shuttles.findOne({ Code: key });

					const desti = await Stopages.findOne({ Name: dest });

					const arr = desti.Shuttles;

					const want = arr.find(
						(item) => Object.keys(item)[0] === mongoData.Code
					);

					if (mongoData) {
						const newObj = {
							Name: stopageName,
							Data: mongoData,
							Time: time,
							ArrivalTime: want[mongoData.Code],
						};

						finalData.push(newObj);
					}
				}
			}

			return finalData;
		}

		const startingData = await Stopages.find({ Name: start });
		const wrappedStartingData = await wrap(startingData);

		const destData = await Stopages.find({ Name: dest });
		const wrappedDestData = await wrap(destData);

		const common = wrappedStartingData.filter((item1) => {
			return wrappedDestData.some(
				(item2) => item2.Data.Code === item1.Data.Code
			);
		});

		function timeToMinutes(timeStr) {
			if (!timeStr) return 0;

			const normalizedTimeStr = timeStr.replace(".", ":").toUpperCase();

			const [time, modifier] = normalizedTimeStr.split(" ");

			const [hoursStr, minutesStr] = time.split(":");
			let hours = parseInt(hoursStr, 10);
			let minutes = parseInt(minutesStr, 10);

			if (isNaN(hours) || isNaN(minutes)) {
				return 0;
			}

			if (modifier === "PM" && hours !== 12) hours += 12;
			if (modifier === "AM" && hours === 12) hours = 0;

			return hours * 60 + minutes;
		}

		const currentTime = timeToMinutes(time);

		async function filterData(data) {
			const dataWithDistances = await Promise.all(
				data.map(async (item) => {
					const a = await Stopages.findOne({ Name: item.Name });
					const b = await Stopages.findOne({ Name: item.Data.Starting });
					const c = await Stopages.findOne({ Name: item.Data.Destination });

					const lat1 = a.location.coordinates[0];
					const long1 = a.location.coordinates[1];
					const lat2 = b.location.coordinates[0];
					const long2 = b.location.coordinates[1];
					const lat3 = c.location.coordinates[0];
					const long3 = c.location.coordinates[1];

					function calculateDistance(lat1, long1, lat2, long2) {
						const R = 6371e3;
						const φ1 = (lat1 * Math.PI) / 180;
						const φ2 = (lat2 * Math.PI) / 180;
						const Δφ = ((lat2 - lat1) * Math.PI) / 180;
						const Δλ = ((long2 - long1) * Math.PI) / 180;

						const x =
							Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
							Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
						const cc = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

						const d = R * cc;

						return d;
					}

					const spottostart = calculateDistance(lat1, long1, lat2, long2);
					const spottodest = calculateDistance(lat1, long1, lat3, long3);

					let valid = false;

					if (spottostart < spottodest) {
						valid = true;
					}

					const time = timeToMinutes(item.Time);

					return { item, time, valid };
				})
			);

			return dataWithDistances
				.filter(({ time, valid }) => valid && time > currentTime)
				.map(({ item }) => item);
		}

		const filteredData = await filterData(common);

		res.json(filteredData);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.put("/updateSpot", async (req, res) => {
	try {
		const { Shuttles } = req.body;

		await Stopages.findOneAndUpdate(
			{ Name: "Hastings" },
			{ Shuttles: Shuttles }
		);
		res.send("saved");
	} catch (error) {
		res.send("error");
	}
});

router.get("/changeshut", async (req, res) => {
	try {
		await Shuttles.updateMany({ Starting: "New Town" }, { Seat: 24 });
		res.send("saved");
	} catch (error) {
		res.send("error");
	}
});

export default router;
