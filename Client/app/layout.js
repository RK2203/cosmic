"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import StoreProvider from "@/Redux/StoreProvider";
import { usePathname } from "next/navigation";
import {  AuthProvider, useToken } from "@/Context/Auth";
import {
	ApolloClient,
	ApolloProvider,
	InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useContext, useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	const noNav = ["/Shuttle_Driver", "/Cab_Driver", "/Driver_Form", "/Signin"];
	const path = usePathname();

	const showNav = !noNav.includes(path);

	const client = new ApolloClient({
		uri: "http://localhost:4000/",
		cache: new InMemoryCache(),
	});

	return (
		<html lang="en">
			<body className={inter.className}>
				<StoreProvider>
					<AuthProvider>
						<ApolloProvider client={client}>
							{showNav && <Navbar />}
							{children}
						</ApolloProvider>
					</AuthProvider>
				</StoreProvider>
			</body>
		</html>
	);
}
