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
		}

		res.json({ msg: "Successfully signed in" });
	} catch (error) {
		res.json({ msg: "Internal server error" });
	}
});

export default router;
