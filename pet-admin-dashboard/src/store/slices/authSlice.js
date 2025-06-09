import { createSlice } from "@reduxjs/toolkit";
import { setCookie, getCookie, removeCookie } from "@/utils/cookies";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // Set cookies
      setCookie("adminToken", action.payload.token, 1); // 1 day expiry
      setCookie("adminUser", JSON.stringify(action.payload.user), 1);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Remove cookies
      removeCookie("adminToken");
      removeCookie("adminUser");
    },
    loadUserFromCookie: (state) => {
      const token = getCookie("adminToken");
      const userStr = getCookie("adminUser");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          console.error("Failed to parse user data from cookie", error);
        }
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  loadUserFromCookie,
} = authSlice.actions;

export default authSlice.reducer;
