import ShuttleDrivers from "../Schemas/ShuttleDriver_schema.js";
import CabDrivers from "../Schemas/CabDriver_schema.js";

import { getAuth } from "firebase-admin/auth";

import admin from "firebase-admin";
import cred from "../credentials.json" assert { type: "json" };
import cookie from "cookie";

const app = admin.initializeApp(
	{
		credential: admin.credential.cert(cred),
	},
	"Drivers"
);

const auth = getAuth(app);

const driverResolver = {
	Mutation: {
		addDriver: async (parent, arg, { req, res }) => {
			try {
				const { token, uid, name, email, car, key } = arg;

				let user;
				try {
					user = await auth.verifyIdToken(token);
				} catch (error) {
					return "Unauthorized";
				}
				try {
					const tokenCookie = cookie.serialize("Token", token, {
						maxAge: 10 * 365 * 24 * 60 * 60,
						httpOnly: true,
						secure: true,
						sameSite: "strict",
						path: "/",
					});
					res.setHeader("Set-Cookie", [tokenCookie]);
				} catch (error) {
					console.log(error);
				}

				if (key === "Shuttle") {
					const user = await ShuttleDrivers.findOne({ UID: uid });

					if (!user) {
						const newuser = new ShuttleDrivers({
							Name: name,
							Email: email,
							Phone: null,
							Car_No: car,
							UID: uid,
							Shutttle_No: null,
						});
						await newuser.save();
					}

					return "Saved";
				}

				if (key === "Cab") {
					const user = await CabDrivers.findOne({ UID: uid });

					if (!user) {
						const newuser = new CabDrivers({
							Name: name,
							Email: email,
							Phone: null,
							Car_No: car,
							UID: uid,
							Trips: [],
						});
						await newuser.save();
					}

					return "Saved";
				}
			} catch (error) {
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
	},

	Query: {
		getCabDriver: async (parent, arg) => {
			const driver = CabDrivers.findOne({ UID: arg.uid });

			return driver;
		},
		getShuttleDriver: async (parent, arg) => {
			console.log(arg);
			const driver = ShuttleDrivers.findOne({ UID: arg.uid });

			return driver;
		},
	},
};

export default driverResolver;
