"use client";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../Firebase";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

const auth = getAuth(app);

export default function RootLayout({ children }) {
	const [user, setuser] = useState(null);
	const [loading, setloading] = useState(true);

	useEffect(() => {
		function getUser() {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					setuser(user);
				} else {
					setuser(null);
				}
				setloading(false);
			});
		}

		return () => getUser();
	}, []);

	if (loading) {
		return null;
	}

	if (!user) {
		redirect("/Signin");
	}

	return <>{children}</>;
}
