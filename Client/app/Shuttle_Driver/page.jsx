"use client";
import { set } from "@/Redux/Driver_Reducer";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function page() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(set(false));
	}, []);

	return <div>page</div>;
}
