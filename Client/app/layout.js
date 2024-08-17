"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import StoreProvider from "@/Redux/StoreProvider";
import { AuthProvider, useToken } from "@/Context/Auth";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { usePathname } from "next/navigation";
import { PrimeReactProvider } from "primereact/api";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	const noNav = ["/Shuttle_Driver", "/Cab_Driver", "/Driver_Form", "/Signin"];
	const path = usePathname();

	const showNav = noNav.includes(path);

	const client = new ApolloClient({
		uri: "http://localhost:8000/graphql",
		credentials: "include",
		cache: new InMemoryCache(),
	});

	return (
		<html lang="en">
			<body className={inter.className}>
				<StoreProvider>
					<ApolloProvider client={client}>
						<AuthProvider>
							<PrimeReactProvider>
								{!showNav && <Navbar />}
								{children}
							</PrimeReactProvider>
						</AuthProvider>
					</ApolloProvider>
				</StoreProvider>
			</body>
		</html>
	);
}
