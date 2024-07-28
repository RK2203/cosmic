import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";
import cred from "../credentials.json" assert { type: "json" };
import { getDatabase } from "firebase-admin/database";
import express from "express";
const router = express.Router();

const app = admin.initializeApp(
	{
		credential: admin.credential.cert(cred),
		databaseURL: "https://cosmic-13139-default-rtdb.firebaseio.com/",
	},
	"Verify"
);

const db = getDatabase(app);

const auth = getAuth(app);

router.post("/verify", async (req, res) => {
	let user;
	const { token } = req.headers;
	try {
		user = await auth.verifyIdToken(token);
	} catch (error) {
		res.json({ msg: "Unauthorized" }).status(401);
	}

	const ref = db.ref(`Roles/${user.uid}/Role`);

	ref
		.once("value")
		.then((snapshot) => {
			const data = snapshot.val();
			res.json({ user: true, role: data });
		})
		.catch((error) => {
			res.json({ msg: "Internal server error", err: error });
		});
});

export default router;
