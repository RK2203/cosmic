import ShuttleDrivers from "../Schemas/ShuttleDriver_schema.js";
import CabDrivers from "../Schemas/CabDriver_schema.js";

const driverResolver = {
	Mutation: {
		addDriver: async (parent, arg, { req, res }) => {
			try {
				const { uid, name, email, dob, phone, car, key } = arg;

				if (key === "Shuttle") {
					const user = await ShuttleDrivers.findOne({ UID: uid });

					if (!user) {
						const newuser = new ShuttleDrivers({
							Name: name,
							Email: email,
							DOB: dob,
							Phone: phone,
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
			const driver = await CabDrivers.findOne({ UID: arg.uid });

			return driver;
		},
		getShuttleDriver: async (parent, arg) => {
			const driver = await ShuttleDrivers.findOne({ UID: arg.uid });

			return driver;
		},
	},
};

export default driverResolver;
