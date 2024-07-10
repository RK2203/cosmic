import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Authenticator";
import driverReducer from "./Driver_Reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfigAuth = {
  key: "authentication",
  storage,
};

const persistConfigDriver = {
  key: "Driver",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);
const persistedDriverReducer = persistReducer(persistConfigDriver, driverReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    isDriver: persistedDriverReducer,
  },
});

export const persistor = persistStore(store);
