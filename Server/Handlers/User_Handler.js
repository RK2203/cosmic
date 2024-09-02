import Users from "../Schemas/User_schema.js";

export async function addNewUser(name, email, uid, image) {
	try {
		const isSaved = await Users.findOne({ UID: uid });

		if (!isSaved) {
			const newuser = new Users({
				Name: name,
				Email: email,
				Phone: null,
				Image: image,
				UID: uid,
				Shuttles: null,
			});
			await newuser.save();
		}
		return "Saved";
	} catch (error) {
		return new Error("Database error");
	}
}

export async function getAUser(uid) {
	try {
		const user = await Users.findOne({ UID: uid });

		return user;
	} catch (err) {
		return new Error("Database error");
	}
}
