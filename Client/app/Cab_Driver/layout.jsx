"use client";

import { authContext } from "@/Context/Auth";
import { redirect } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";

export default function layout({ children }) {
	const { user, loading, role } = useContext(authContext);

	useEffect(() => {
		if (!loading) {
			if (!user) {
				redirect("/");
			}
			if (role == "Rider") {
				redirect("/");
			}
			if (role == "Shuttle") {
				redirect("/Shuttle_Driver");
			}
		}
	}, [loading, user, role]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}
