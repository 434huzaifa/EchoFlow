import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "loading", // 👈 important
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      if (action.payload.user) state.user = action.payload.user;
      if (action.payload.accessToken)
        state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken)
        state.refreshToken = action.payload.refreshToken;
      state.status = "authenticated";
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "unauthenticated";
    },
    authChecked: (state) => {
      if (!state.accessToken) {
        state.status = "unauthenticated";
      }
    },
  },
});

export const { setCredentials, logout, authChecked } = authSlice.actions;
export default authSlice.reducer;
