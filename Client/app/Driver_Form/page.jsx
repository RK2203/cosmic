"use client";

import { authContext } from "@/Context/Auth";
import { update } from "@/Redux/Authenticator";
import { gql, useMutation } from "@apollo/client";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import app from "@/Firebase";
import { getDatabase, set, ref } from "firebase/database";

const db = getDatabase(app);

export default function page() {
	const query = gql`
		mutation adddriver(
			$token: String!
			$uid: String!
			$name: String!
			$email: String!
			$car: String!
			$key: String!
		) {
			addDriver(
				token: $token
				uid: $uid
				name: $name
				email: $email
				car: $car
				key: $key
			)
		}
	`;
	const { user, loading, role } = useContext(authContext);
	const [addDriver, { data, _, error }] = useMutation(query);

	const router = useRouter();

	const param = useSearchParams();
	const token = param.get("token");

	const submit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		const data = Object.fromEntries(formData.entries());

		const { name, key, car } = data;

		const res = await addDriver({
			variables: {
				token,
				uid: user.uid,
				name,
				email: user.email,
				car,
				key,
			},
		});

		console.log(res);

		try {
			set(ref(db, "Roles/" + user.uid), {
				Role: key,
			});
			router.push(`/${key}_Driver`);
		} catch (error) {
			console.log(error);
		}

	};

	if (loading) {
		return <div>Loading...</div>;
	}

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
						type="text"
						name="key"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-black  appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="floating_email"
						class="peer-focus:font-medium absolute text-sm text-gray-900  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
						Enter your key
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
