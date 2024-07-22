import Users from "../Schemas/User_schema.js";
import { getAuth } from "firebase-admin/auth";

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
		adduser: async (parent, arg) => {
			let user;
			console.log(arg.token);
			try {
				user = await auth.verifyIdToken(arg.token);
			} catch (error) {
				return {};
			}

			admin
				.auth()
				.setCustomUserClaims(user.uid, {
					role: "Rider",
				})
				.then(() => {
					console.log("saved");
				})
				.catch((err) => {
					console.log(err);
				});

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
			const det = await Users.findOne({ UID: user.uid });
			return det;
		},
	},
};
export default userResolver;
