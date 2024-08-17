import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import admin from "firebase-admin";
import cred from "../../../credentials.json" assert { type: "json" };

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(cred),
		databaseURL: "https://cosmic-13139-default-rtdb.firebaseio.com/",
	});
}

const db = getDatabase();
const auth = getAuth();

export async function POST(request) {
	try {
		const headers = request.headers;
		const token = headers.get("token");

		if (!token) {
			return new Response(JSON.stringify({ message: "Token missing" }), {
				headers: { "Content-Type": "application/json" },
				status: 400, 
			});
		}

		const user = await auth.verifyIdToken(token);
		if (!user) {
			return new Response(JSON.stringify({ message: "Unauthorized" }), {
				headers: { "Content-Type": "application/json" },
				status: 401, 
			});
		} else {
			const ref = db.ref(`Roles/${user.uid}/Role`);
			let msg = {};

			await ref
				.once("value")
				.then((snapshot) => {
					const data = snapshot.val();
					msg = { user: true, role: data };
				})
				.catch((error) => {
					msg = { user: true, role: null };
					console.error("Database error:", error);
				});

			return new Response(JSON.stringify(msg), {
				headers: { "Content-Type": "application/json" },
				status: 200, 
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: "Internal server error" }), {
			headers: { "Content-Type": "application/json" },
			status: 500, 
		});
	}
}
