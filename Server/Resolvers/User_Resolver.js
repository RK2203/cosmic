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
			try {
				const user = await auth.verifyIdToken(arg.token);
				if (user) {
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
				} else {
					return "Unauthorized";
				}
			} catch (error) {
				console.log(error);

				return "Internal server error";
			}
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
		refresh: async (parent, args, { req, res }) => {
			try {
				const user = await auth.verifyIdToken(args.token);

				if (user) {
					const tokenCookie = cookie.serialize("Token", args.token, {
						maxAge: 10 * 365 * 24 * 60 * 60,
						httpOnly: true,
						secure: true,
						sameSite: "strict",
						path: "/",
					});

					res.setHeader("Set-Cookie", [tokenCookie]);

					return "Refreshed";
				} else {
					return "Unauthorized";
				}
			} catch (error) {
				console.log(error);

				return "Internal server error";
			}
		},
	},

	Query: {
		getUser: async (parent, arg, { req, res }) => {
			try {
				const resToken = req.headers.cookie;

				const tokenPart = resToken.split("Token=")[1];

				const token = tokenPart.split(";")[0];

				const user = await auth.verifyIdToken(token);

				if (user) {
					const user = await Users.findOne({ UID: arg.uid });
					return user;
				} else {
					return "Unauthorized";
				}
			} catch (error) {
				return "Internal server error";
			}
		},
	},
};
export default userResolver;
