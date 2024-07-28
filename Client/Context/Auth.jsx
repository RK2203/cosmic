"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import app from "@/Firebase";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { useRouter } from "next/navigation";

const auth = getAuth(app);
const db = getDatabase(app);

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [role, setRole] = useState(null);

	useEffect(() => {
		const unsubscribe = async () => {
			auth.onAuthStateChanged(async (user) => {
				if (user) {
					setUser(user);
					const dataref = ref(db, "Roles/" + user.uid);
					onValue(dataref, (res) => {
						const data = res.val();
						setRole(data.Role);
						setLoading(false);
					});
				} else {
					setUser(null);
					setLoading(false);
				}
			});
		};

		return () => unsubscribe();
	}, []);

	return (
		<authContext.Provider value={{ user, loading, role }}>
			{children}
		</authContext.Provider>
	);
};

export const useAuth = () => useContext(authContext);
