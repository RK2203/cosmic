"use client";

import { authContext } from "@/Context/Auth";
import { update } from "@/Redux/Authenticator";
import { redirect, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
	const userr = JSON.parse(useSelector((state) => state.auth.user));
	const { user, loading, role } = useContext(authContext);

	const dispatch = useDispatch();
	const router = useRouter();

	const submit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		const data = Object.fromEntries(formData.entries());

		await fetch("http://localhost:8000/Drivers/updatedriver", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				uid: userr.UID,
			},
			body: JSON.stringify(data),
		})
			.then((res) => {
				return res.json();
			})
			.then((res) => {
				dispatch(update(JSON.stringify(res)));
				router.push(`/${role}_Driver`);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		if (loading) return;
		if (!user) {
			redirect("/");
		}
		if (role == "Rider") {
			redirect("/");
		}
	}, [user, role, loading]);

	return (
		<div>
			<form class="max-w-md mx-auto light my-20 p-16" onSubmit={submit}>
				<div class="relative z-0 w-full mb-5 group">
					<input
						type="text"
						name="name"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-black appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=""
						required
					/>
					<label
						for="floating_password"
						class="peer-focus:font-medium absolute text-sm text-gray-900  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Full name
					</label>
				</div>
				<div class="relative z-0 w-full mb-5 group">
					<input
						type="email"
						name="email"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-black  appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="floating_email"
						class="peer-focus:font-medium absolute text-sm text-gray-900  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Email address
					</label>
				</div>
				<div class="relative z-0 w-full mb-5 group">
					<input
						type="text"
						name="car"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-black appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="floating_repeat_password"
						class="peer-focus:font-medium absolute text-sm text-gray-900  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Vehicle Number
					</label>
				</div>

				<div className="flex justify-center ">
					<button
						type="submit"
						class=" but font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
