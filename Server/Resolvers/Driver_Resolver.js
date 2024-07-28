import ShuttleDrivers from "../Schemas/ShuttleDriver_schema.js";
import CabDrivers from "../Schemas/CabDriver_schema.js";

import { getAuth } from "firebase-admin/auth";

import admin from "firebase-admin";
import cred from "../credentials.json" assert { type: "json" };

const app = admin.initializeApp(
	{
		credential: admin.credential.cert(cred),
	},
	"Drivers"
);

const auth = getAuth(app);

const driverResolver = {
	Mutation: {
		addDriver: async (parent, arg) => {
			try {
				const { uid, name, email, car, key } = arg;

				const userRecord = await auth.getUser(uid);
				if (!userRecord) {
					return "User not found";
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
	},

	Query: {
		getCabDriver: async (parent, arg) => {
			const driver = CabDrivers.findOne({ UID: arg.uid });

			return driver;
		},
	},
};

export default driverResolver;
