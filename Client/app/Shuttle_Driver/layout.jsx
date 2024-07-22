"use client";

import { authContext } from "@/Context/Auth";
import { redirect } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";

export default function layout({ children }) {
	const { user, loading, role } = useContext(authContext);

	useEffect(() => {
		if (!loading) {
			console.log(role);
			if (!user) {
				redirect("/");
			}
			if (role == "Rider") {
				redirect("/");
			}
			if (role == "Cab") {
				redirect("/Cab_Driver");
			}
		}
	}, [loading, user, role]);

	if (loading) {
		return <div>Loading...</div>;
	}
	return <>{children}</>;
}
