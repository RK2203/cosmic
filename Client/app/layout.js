"use client";

import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import StoreProvider from "@/Redux/StoreProvider";
import { AuthProvider, useToken } from "@/Context/Auth";
import {
	ApolloClient,
	ApolloProvider,
	InMemoryCache,
	useApolloClient,
} from "@apollo/client";
import { usePathname } from "next/navigation";
import { PrimeReactProvider } from "primereact/api";
import NextTopLoader from "nextjs-toploader";
import { ApolloClientsProvider, useApolloClients } from "@/Context/Apollo";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	const noNav = [
		"/Shuttle_Driver",
		"/Cab_Driver",
		"/Driver_Form",
		"/Signin",
		"/Signin/User",
	];
	const path = usePathname();

	const showNav = noNav.includes(path);

	const clien1 = new ApolloClient({
		uri: "http://localhost:8000/graphql",
		credentials: "include",
		cache: new InMemoryCache(),
	});
	const clien2 = new ApolloClient({
		uri: "http://localhost:7000/Shuttle_endpoint",
		credentials: "include",
		cache: new InMemoryCache(),
	});

	

	return (
		<html lang="en">
			<body className={inter.className}>
				<StoreProvider>
					<ApolloProvider client={{ clien1, clien2 }}>
						<ApolloClientsProvider>
							<AuthProvider>
								<PrimeReactProvider>
									<NextTopLoader color="#8585f8" speed={200} />
									{!showNav && <Navbar />}
									{children}
								</PrimeReactProvider>
							</AuthProvider>
						</ApolloClientsProvider>
					</ApolloProvider>
				</StoreProvider>
			</body>
		</html>
	);
}
