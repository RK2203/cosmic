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
	const { token } = req.headers;

	try {
		const user = await auth.verifyIdToken(token);
		if (!user) {
			res.json({ msg: "Unauthorized" }).status(401);
		} else {
			const ref = db.ref(`Roles/${user.uid}/Role`);

			ref
				.once("value")
				.then((snapshot) => {
					const data = snapshot.val();
					res.json({ user: true, role: data });
				})
				.catch((error) => {
					res.json({ user: true, role: null });
				});
		}
	} catch (error) {
		res.json({ msg: "Internal Server error" }).status(500);
	}
});

export default router;
