import express from "express";
import Users from "../Schemas/User_schema.js";

import { getAuth } from "firebase-admin/auth";

import admin from "firebase-admin";
import cred from "../credentials.json" assert { type: "json" };

const router = express.Router();

const app = admin.initializeApp({
	credential: admin.credential.cert(cred),
});

const auth = getAuth(app);

router.post("/adduser/", async (req, res) => {
	try {
		const { token } = req.headers;

		let user;

		try {
			user = await auth.verifyIdToken(token);
		} catch (error) {
			return res.json({ msg: "Invalid user" }).status(401);
		}

		admin
			.auth()
			.setCustomUserClaims(user.uid, {
				role: "Rider",
			})
			.then(() => {
				console.log("saved");
			})
			.catch((err) => {
				console.log(err);
			});

		const isSaved = await Users.findOne({ UID: user.uid });

		if (!isSaved) {
			const newuser = new Users({
				Name: null,
				Email: null,
				Phone: user.phone_number,
				UID: user.uid,
				Shuttles: null,
			});
			await newuser.save();
		}
		const det = await Users.findOne({ UID: user.uid });

		res.json(det);
	} catch (error) {
		res.json({ msg: "Internal server error" });
	}
});

export default router;
