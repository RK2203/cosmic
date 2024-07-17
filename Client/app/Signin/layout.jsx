"use client";
import { authContext } from "@/Context/Auth";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

export default function layout({ children }) {
	const { user, loading, role } = useContext(authContext);
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (user) {
				if (role !== "Rider") {
					router.replace(`${role}_Driver`);
				}
				router.replace("/");
			}
		}
	}, [loading, user, role, router]);

	if (!loading) {
		return <>{children}</>;
	}
}
