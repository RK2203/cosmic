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
				const { token, name, car, key } = arg;

				let user;

				try {
					user = await auth.verifyIdToken(token);
				} catch (error) {
					return {};
				}

				function setRole(role) {
					admin
						.auth()
						.setCustomUserClaims(user.uid, {
							role: role,
						})
						.then(() => {
							console.log("saved");
						})
						.catch((err) => {
							console.log(err);
						});
				}

				if (key == "Shuttle") {
					const isSaved = await ShuttleDrivers.findOne({ UID: user.uid });

					if (!isSaved) {
						const newuser = new ShuttleDrivers({
							Name: name,
							Email: user.email ? user.email : null,
							Phone: user.phone_number ? user.phone_number : null,
							Car_No: car,
							UID: user.uid,
							Shutttle_No: null,
						});
						await newuser.save();
					}
					setRole(key);

					const det = await ShuttleDrivers.findOne({ UID: user.uid });

					return det;
				}

				if (key == "Cab") {
					const isSaved = await CabDrivers.findOne({ UID: user.uid });

					if (!isSaved) {
						const newuser = new CabDrivers({
							Name: name,
							Email: user.email ? user.email : null,
							Phone: user.phone_number ? user.phone_number : null,
							Car_No: car,
							UID: user.uid,
							Trips: [],
						});
						await newuser.save();
					}

					setRole(key);
					const det = await CabDrivers.findOne({ UID: user.uid });

					return;
				}
			} catch (error) {
				return {};
			}
		},
	},
};

export default driverResolver;
