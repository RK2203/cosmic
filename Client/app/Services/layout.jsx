"use client";

import { authContext } from "@/Context/Auth";
import { redirect } from "next/navigation";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";

export default function RootLayout({ children }) {
	const { user, loading, role } = useContext(authContext);

	useEffect(() => {
		if (!user) {
			redirect("/Signin");
		}
		if (role !== "Rider") {
			router.replace(`${role}_Driver`);
		}
	}, [loading]);

	return <>{children}</>;
}
