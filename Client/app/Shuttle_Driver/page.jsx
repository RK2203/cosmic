"use client";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCamera } from "react-icons/fa";
import { signOut, getAuth } from "firebase/auth";
import app from "@/Firebase";
import { update } from "@/Redux/Authenticator";
import { useRouter } from "next/navigation";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { authContext, useAuth } from "@/Context/Auth";
import { useApolloClients } from "@/Context/Apollo";

const auth = getAuth(app);

export default function page() {
	const query = gql`
		query getshutdriver($uid: ID!) {
			getShuttleDriver(uid: $uid) {
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

	const [driver, setDriver] = useState(null);
	const { client1 } = useApolloClients();
	const [getShuttleDriver] = useLazyQuery(query, { client: client1 });
	const [logout] = useMutation(logoutQuery, { client: client1 });

	const { user, loading } = useAuth();

	const router = useRouter();
	

	const getDriver = async () => {
		const res = await getShuttleDriver({
			variables: {
				uid: user.uid,
			},
		});

		console.log(res);

		if (res.data) {
			setDriver(res.data.getShuttleDriver);
		}
	};

	useEffect(() => {
		if (user) {
			getDriver();
		}
	}, [user, loading]);

	const logOut = () => {
		signOut(auth)
			.then(async () => {
				const res = await logout();
				console.log(res);
				router.push("/");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div class="flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
			<div class="w-full lg:w-1/4 bg-muted border-r-2 p-4">
				<ul class="space-y-4">
					<li class="text-primary font-semibold">Menu</li>
					<li>Account</li>
					<li>Passengers</li>
					<li>Security</li>
					<li>Privacy & Data</li>
					<li className="cursor-default" onClick={logOut}>
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
							<p>{driver && driver.Name ? driver.Name : "Change your name"}</p>
						</div>
						<span class="text-muted-foreground"></span>
					</div>
					<div class="flex flex-col lg:flex-row justify-between items-center border-b border-muted pb-4">
						<div>
							<h3 class="text-lg lg:text-xl font-medium">Phone number</h3>
							<p>
								{driver && driver.Phone ? driver.Phone : "Add phone number"}
								<span class="text-green-500">✔</span>
							</p>
						</div>
						<span class="text-muted-foreground"></span>
					</div>
					<div class="flex flex-col lg:flex-row justify-between items-center border-b border-muted pb-4">
						<div>
							<h3 class="text-lg lg:text-xl font-medium">Email</h3>
							<p>
								{driver && driver.Email ? driver.Email : "Change your Email"}{" "}
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
