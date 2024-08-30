import { getAuth } from "firebase-admin/auth";

import admin from "firebase-admin";
import cred from "../credentials.json" assert { type: "json" };

const app = admin.initializeApp(
	{
		credential: admin.credential.cert(cred),
	},
	"Auth Server"
);

const auth = getAuth(app);

const verifyToken = async (req, res, next) => {
	try {
		let token;

		if (Object.keys(req.body.variables).includes("token")) {
			token = req.body.variables.token;
		} else {
			token = req.cookies.Token;
		}

		if (!token) {
			res.status(403).json({ msg: "Token unavialable" });
			return;
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
