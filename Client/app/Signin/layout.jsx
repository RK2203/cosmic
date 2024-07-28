"use client";
import { authContext, useAuth } from "@/Context/Auth";
import { redirect, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function Layout({ children }) {
	const { user, loading, role } = useAuth();
	const router = useRouter();

	

	if (loading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}
