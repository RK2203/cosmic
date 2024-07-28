"use client";

import { authContext } from "@/Context/Auth";
import { redirect } from "next/navigation";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";

export default function RootLayout({ children }) {
	const { user, loading, role } = useContext(authContext);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}
