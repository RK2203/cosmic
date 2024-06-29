import express from "express";
import Users from "../Schemas/User_schema.js";
import admin from "firebase-admin";
import credentials from "../credentials.json" assert { type: "json" };

const router = express.Router();

admin.initializeApp({
	credential: admin.credential.cert(credentials),
});

router.post("/adduser", async (req, res) => {
	try {
		const { name, email, phone, uid, token } = req.body;

		const newuser = new Users({
			Name: name,
			Email: email,
			Phone: phone,
			UID: uid,
			Shuttles: null,
		});

		await newuser.save();
		res.json({ msg: "Successfully signed in" });
	} catch (error) {
		res.json({ msg: "Internal server error" });
	}
});

export default router;
