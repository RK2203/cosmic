"use client";

import React, { useContext, useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { redirect, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signOut, getAuth } from "firebase/auth";
import app from "@/Firebase";
import { update } from "@/Redux/Authenticator";
import { authContext, useAuth } from "@/Context/Auth";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useApolloClients } from "@/Context/Apollo";

const auth = getAuth(app);

export default function user() {
	const { client1 } = useApolloClients();

	const query = gql`
		query getuser($uid: ID!) {
			getUser(uid: $uid) {
				Name
				Email
				Phone
			}
		}
	`;

	const logoutQuery = gql`
		mutation LogOut {
			logout
		}
	`;
	const { user, loading } = useAuth();
	const [getUser] = useLazyQuery(query, { client: client1 });
	const [logout] = useMutation(logoutQuery, { client: client1 });
	const [det, setDet] = useState(null);
	const router = useRouter();

	const getData = async () => {
		if (user) {
			const res = await getUser({
				variables: {
					uid: user.uid,
				},
			});
			

			console.log(res);
			

			setDet(res.data.getUser);
		}
	};

	const logOut = () => {
		signOut(auth)
			.then(async () => {
				const res = await logout();
				console.log(res);
				router.replace("/");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getData();
	}, [user, loading]);

	return (
		<div class="flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
			<div class="w-full lg:w-1/4 bg-muted border-r-2 p-4">
				<ul class="space-y-4">
					<li class="text-primary font-semibold">Menu</li>
					<li>Security</li>
					<li>Privacy & Data</li>
					<li onClick={logOut} className="cursor-default">
						Log Out
					</li>
				</ul>
			</div>
			<div class="w-full lg:w-3/4 p-8">
				<h1 class="text-3xl lg:text-4xl font-bold mb-6">Account Info</h1>
				<div class="flex flex-col lg:flex-row items-center mb-6">
					<div className="relative inline-block">
						<img
							class="w-24 h-24 lg:w-32 lg:h-32 rounded-full mb-4 lg:mr-4 lg:mb-0"
							src="https://placehold.co/96x96"
							alt="User profile picture"
						/>
						<FaCamera className="h-6 w-6 absolute bottom-2 right-6" />
					</div>
					<div></div>
				</div>
				<div class="space-y-6">
					<div class="flex flex-col lg:flex-row justify-between items-center border-b border-muted pb-4">
						<div>
							<h3 class="text-lg lg:text-xl font-medium">Name</h3>
							<p>{det && det.Name ? det.Name : "Set your name..."}</p>
						</div>
						<span class="text-muted-foreground"></span>
					</div>
					<div class="flex flex-col lg:flex-row justify-between items-center border-b border-muted pb-4">
						<div>
							<h3 class="text-lg lg:text-xl font-medium">Phone number</h3>
							<p>
								{det && det.Phone ? det.Phone : "Add phone number"}{" "}
								<span class="text-green-500">✔</span>
							</p>
						</div>
						<span class="text-muted-foreground"></span>
					</div>
					<div class="flex flex-col lg:flex-row justify-between items-center border-b border-muted pb-4">
						<div>
							<h3 class="text-lg lg:text-xl font-medium">Email</h3>
							<p>
								{det && det.Email ? det.Email : "Add email"}{" "}
								<span class="text-green-500">✔</span>
							</p>
						</div>
						<span class="text-muted-foreground"></span>
					</div>
				</div>
			</div>
		</div>
	);
}
