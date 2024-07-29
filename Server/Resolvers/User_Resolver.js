import Users from "../Schemas/User_schema.js";
import { getAuth } from "firebase-admin/auth";
import cookie from "cookie";

import admin from "firebase-admin";
import cred from "../credentials.json" assert { type: "json" };

const app = admin.initializeApp(
	{
		credential: admin.credential.cert(cred),
	},
	"Users"
);

const auth = getAuth(app);

const userResolver = {
	Mutation: {
		adduser: async (parent, arg, { req, res }) => {
			let user;
			try {
				user = await auth.verifyIdToken(arg.token);
			} catch (error) {
				return "Unauthorized";
			}

			const tokenCookie = cookie.serialize("Token", arg.token, {
				maxAge: 10 * 365 * 24 * 60 * 60,
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
			});

			res.setHeader("Set-Cookie", [tokenCookie]);

			const isSaved = await Users.findOne({ UID: user.uid });

			if (!isSaved) {
				const newuser = new Users({
					Name: user.name,
					Email: user.email,
					Phone: user.phone_number ? user.phone_number : null,
					UID: user.uid,
					Shuttles: null,
				});
				await newuser.save();
			}
			return "Saved";
		},

		logout: async (parent, args, { req, res }) => {
			const tokenCookie = cookie.serialize("Token", null, {
				maxAge: 0,
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
			});

			res.setHeader("Set-Cookie", [tokenCookie]);

			return "Logged out";
		},
	},

	Query: {
		getUser: async (parent, arg) => {
			const user = await Users.findOne({ UID: arg.uid });
			return user;
		},
	},
};
export default userResolver;
