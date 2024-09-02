"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import app from "@/Firebase";
import { useCookie } from "./Cookie";

const auth = getAuth(app);

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const { setToken } = useCookie();

	useEffect(() => {
		const unsubscribe = async () => {
			auth.onAuthStateChanged(async (user) => {
				if (user) {
					await user.getIdToken().then(async (token) => {

						setToken(token);
					});
					setUser(user);
					setLoading(false);
				} else {
					setUser(null);
					setLoading(false);
				}
			});
		};

		return () => unsubscribe();
	}, []);

	return (
		<authContext.Provider value={{ user, loading }}>
			{children}
		</authContext.Provider>
	);
};

export const useAuth = () => useContext(authContext);
