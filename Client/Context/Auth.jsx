"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import app from "@/Firebase";
import { gql, useMutation } from "@apollo/client";

const auth = getAuth(app);

export const authContext = createContext(null);

const query = gql`
	mutation Refresh($token: String!) {
		refresh(token: $token)
	}
`;

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [refresh] = useMutation(query);

	useEffect(() => {
		const unsubscribe = async () => {
			auth.onAuthStateChanged(async (user) => {
				if (user) {
					await user.getIdToken().then(async (token) => {
						const res = await refresh({
							variables: {
								token,
							},
						});
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
