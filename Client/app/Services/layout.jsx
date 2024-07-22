"use client";

import { authContext } from "@/Context/Auth";
import { redirect } from "next/navigation";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";

export default function RootLayout({ children }) {
	const { user, loading, role } = useContext(authContext);

	useEffect(() => {
		if (!loading) {
			if (!user) {
				redirect("/Signin");
			}
			if (role !== "Rider") {
				redirect(`/${role}_Driver`);
			}
		}
	}, [loading]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}
