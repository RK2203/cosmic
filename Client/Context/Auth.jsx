import { createContext, useContext, useEffect, useState } from "react";
import {
	onAuthStateChanged,
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import app from "@/Firebase";

const auth = getAuth(app);

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [role, setRole] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				setUser(user);
				const token = await user.getIdTokenResult();
				setRole(token.claims.role);
			} else {
				setUser(null);
				setRole(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return (
		<authContext.Provider value={{ user, loading, role }}>
			{children}
		</authContext.Provider>
	);
};
