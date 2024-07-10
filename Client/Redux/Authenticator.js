import { createSlice } from "@reduxjs/toolkit";


const initialState = {
	user: null,
};

export const authenticator = createSlice({
	name: "auth",
	initialState,

	reducers: {
		update: (state, action) => {
			state.user = action.payload;
		},
	},
});

export const { update } = authenticator.actions;
export default authenticator.reducer;
