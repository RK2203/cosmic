import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Authenticator";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfigAuth = {
	key: "authentication",
	storage,
};

const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);

export const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
	},
});

export const persistor = persistStore(store);
