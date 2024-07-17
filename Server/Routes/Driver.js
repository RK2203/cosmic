import express from "express";
import ShuttleDrivers from "../Schemas/ShuttleDriver_schema.js";
import CabDrivers from "../Schemas/CabDriver_schema.js";

import { getAuth } from "firebase-admin/auth";

import admin from "firebase-admin";

import cred from "../credentials.json" assert { type: "json" };

const router = express.Router();

const app = admin.initializeApp(
	{
		credential: admin.credential.cert(cred),
	},
	"shutlleDrivers"
);

const auth = getAuth(app);

router.post("/adddriv", async (req, res) => {
	try {
		const { token, key } = req.headers;

		let user;

		try {
			user = await auth.verifyIdToken(token);
		} catch (error) {
			return res.json({ msg: "Invalid user" }).status(401);
		}

		function setRole(role) {
			admin
				.auth()
				.setCustomUserClaims(user.uid, {
					role: role,
				})
				.then(() => {
					console.log("saved");
				})
				.catch((err) => {
					console.log(err);
				});
		}

		if (key == "Shuttle") {
			const isSaved = await ShuttleDrivers.findOne({ UID: user.uid });

			if (!isSaved) {
				const newuser = new ShuttleDrivers({
					Name: null,
					Email: null,
					Phone: user.phone_number,
					Car_No: null,
					UID: user.uid,
					Shutttle_No: null,
					Passengers: [],
				});
				await newuser.save();
			}
			setRole(key);

			const det = await ShuttleDrivers.findOne({ UID: user.uid });

			res.json(det);
		}

		if (key == "Cab") {
			const isSaved = await CabDrivers.findOne({ UID: user.uid });

			if (!isSaved) {
				const newuser = new CabDrivers({
					Name: null,
					Email: null,
					Phone: user.phone_number,
					Car_No: null,
					UID: user.uid,
					Trips: [],
				});
				await newuser.save();
			}

			setRole(key);
			const det = await CabDrivers.findOne({ UID: user.uid });

			res.json(det);
		}
	} catch (error) {
		res.json({ msg: "Internal server error" });
	}
});

router.post("/updatedriver", async (req, res) => {
	try {
		const { name, email, car } = req.body;
		const { uid } = req.headers;

		const shut = await ShuttleDrivers.findOne({ UID: uid });
		const cab = await CabDrivers.findOne({ UID: uid });

		console.log(uid);

		if (cab) {
			await CabDrivers.findOneAndUpdate(
				{ UID: uid },
				{ Name: name, Email: email, Car_No: car }
			);

			const driver = await CabDrivers.findOne({ UID: uid });

			res.json(driver);
		}
		if (shut) {
			await ShuttleDrivers.findOneAndUpdate(
				{ UID: uid },
				{ Name: name, Email: email, Car_No: car }
			);

			const driver = await ShuttleDrivers.findOne({ UID: uid });

			res.json(driver);
		}
	} catch (error) {
		res.json({ msg: "Internal server error" });
	}
});

export default router;
