import { getAuth } from "firebase-admin/auth";

import admin from "firebase-admin";
import cred from "../credentials.json" assert { type: "json" };

const app = admin.initializeApp(
	{
		credential: admin.credential.cert(cred),
	},
	"Shuttle Server"
);

const auth = getAuth(app);

const verifyToken = async (req, res, next) => {
	const cookie = req.headers.cookie;

	try {
		const token = cookie.split("Token=")[1];
		if (!token) {
			res.status(403).json({ msg: "Token unavialable" });
		}

		try {
			const user = await auth.verifyIdToken(token);

			next();
		} catch (error) {
			res.status(401).json({ msg: "Unauthorized", error: error });
		}
	} catch (error) {
		res.status(401).json({ msg: "Unauthorized", error: error });
	}
};

export default verifyToken;
