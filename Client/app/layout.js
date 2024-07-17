"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import StoreProvider from "@/Redux/StoreProvider";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/Context/Auth";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
	const noNav = ["/Shuttle_Driver", "/Cab_Driver", "/Driver_Form", "/Signin"];
	const path = usePathname();

	const showNav = !noNav.includes(path);

	return (
		<html lang="en">
			<body className={inter.className}>
				<StoreProvider>
					<AuthProvider>
						{showNav && <Navbar />}
						{children}
					</AuthProvider>
				</StoreProvider>
			</body>
		</html>
	);
}
