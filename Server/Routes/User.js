import express from "express";
import Users from "../Schemas/User_schema.js";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import admin from "firebase-admin";

import cred from "../credentials.json" assert { type: "json" };

const router = express.Router();

const app = admin.initializeApp({
	credential: admin.credential.cert(cred),
});

const auth = getAuth(app);

router.post("/adduser/:uid", async (req, res) => {
	try {
		const { token } = req.headers;
		const { uid } = req.params;

		console.log(uid);

		let user;

		try {
			user = await auth.verifyIdToken(token);
		} catch (error) {
			return res.json({ msg: "Invalid user" }).status(401);
		}

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
		res.json({ msg: "Successfully signed in" });
	} catch (error) {
		res.json({ msg: "Internal server error" });
	}
});

export default router;
