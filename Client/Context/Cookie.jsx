import React, { createContext, useContext } from "react";
import { useApolloClients } from "./Apollo";
import { gql, useMutation } from "@apollo/client";

const cookieContext = createContext(null);

const query = gql`
	mutation sendCookie($token: String!) {
		setCookie(token: $token)
	}
`;

export const CookieProvider = ({ children }) => {
	const { client1 } = useApolloClients();
	const [setCookie] = useMutation(query, { client: client1 });
	const setToken = async (token) => {

		const res = await setCookie({
			variables: {
				token,
			},
		});
		

		
		console.log(res);
	};

	return (
		<cookieContext.Provider value={{ setToken }}>
			{children}
		</cookieContext.Provider>
	);
};

export const useCookie = () => useContext(cookieContext);
