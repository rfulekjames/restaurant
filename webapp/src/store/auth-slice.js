import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    restaurantName: null,
    userName: null,
    uid: null,
  },
  reducers: {
    loginUser(state, action) {
      state.isLoggedIn = true;
      state.userName = action.payload.username;
      state.uid = action.payload.uid;
    },
    logoutUser(state) {
      state.isLoggedIn = false;
      state.userName = null;
      state.uid = null;
      state.restaurantName = null;
    },
    setRestaurant(state, action) {
      state.restaurantName = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
