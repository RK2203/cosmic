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
		const { lat, long } = req.body;

		console.log(`Received coordinates: lat=${lat}, long=${long}`);

		const results = await Stopages.aggregate([
			{
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [lat, long],
					},
					distanceField: "dist.calculated",
					maxDistance: 2000,
					spherical: true,
				},
			},
		]).exec();

		if (!results.length) {
			return res.status(404).json({ message: "No stopages found nearby" });
		}

		const finalData = [];

		for (const result of results) {
			const stopageName = result.Name;
			const shuttles = result.Shuttles;

			for (const shuttleObj of shuttles) {
				const key = Object.keys(shuttleObj)[0];
				const time = shuttleObj[key];

				const mongoData = await Shuttles.findOne({ Code: key });

				if (mongoData) {
					const newObj = {
						Name: stopageName,
						Data: mongoData,
						Time: time,
					};

					finalData.push(newObj);
				}
			}
		}

		res.json(finalData);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/search", async (req, res) => {
	try {
		const { start, dest } = req.body;

		const startfound = await Stopages.findOne({ Name: start });
		const destfound = await Stopages.findOne({ Name: dest });

		if (!startfound) {
			res.json({ msg: "No nearby pick up spot found " });
		}
		if (!destfound) {
			res.json({ msg: "No nearby destination found " });
		}

		const starting = await Stopages.findOne({ Name: start });
		const destination = await Stopages.findOne({ Name: dest });

		res.json(starting);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.put("/updateSpot", async (req, res) => {
	try {
		const { Shuttles } = req.body;

		await Stopages.findOneAndUpdate(
			{ Name: "New Town" },
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
