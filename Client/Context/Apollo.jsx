import React, { createContext, useContext } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const ApolloClientsContext = createContext(null);

export const ApolloClientsProvider = ({ children }) => {
  const client1 = new ApolloClient({
    uri: "http://localhost:8000/graphql",
    credentials: "include",
    cache: new InMemoryCache(),
  });

  const client2 = new ApolloClient({
    uri: "http://localhost:7000/Shuttle_endpoint",
    credentials: "include",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloClientsContext.Provider value={{ client1, client2 }}>
      {children}
    </ApolloClientsContext.Provider>
  );
};

export const useApolloClients = () => useContext(ApolloClientsContext);
