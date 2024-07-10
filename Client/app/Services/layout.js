"use client";

import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function RootLayout({ children }) {
	const user = useSelector((state) => state.auth.user);

	if (!user) {
		redirect("/Signin");
	}

	return <>{children}</>;
}
