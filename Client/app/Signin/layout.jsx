"use client";
import { authContext } from "@/Context/Auth";
import { redirect, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function Layout({ children }) {
	const { user, loading, role } = useContext(authContext);
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (user) {
				if (role !== "Rider") {
					redirect(`/${role}_Driver`);
				} else {
					redirect("/");
				}
			}
		}
	}, [loading, user, role, router]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}
