import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	driver: false,
};

export const isDriver = createSlice({
	name: "isDriver",
	initialState,

	reducers: {
		set: (state, action) => {
			state.driver = action.payload;
		},
	},
});

export const { set } = isDriver.actions;
export default isDriver.reducer;
