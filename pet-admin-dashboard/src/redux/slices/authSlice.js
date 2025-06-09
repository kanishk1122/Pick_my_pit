import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../api";
import { setCookie, removeCookie, getCookie } from "../../utils/cookieUtils";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetchData("/auth/login", {
        method: "POST",
        data: credentials,
      });

      // Validate response structure
      if (!response.user || !response.token) {
        console.error("Invalid login response structure:", response);
        return rejectWithValue({
          message: "Invalid login response from server",
        });
      }

      // Ensure user has required fields
      if (!response.user.role) {
        console.error("User data missing role field:", response.user);
        return rejectWithValue({ message: "User data is incomplete" });
      }

      // Save user data and token to cookies with longer expiration
      setCookie("adminToken", response.token, 30);
      setCookie("adminUser", response.user, 30);

      // Explicitly set the user right away
      dispatch(setUser(response.user));

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchData("/auth/logout", {
        method: "POST",
      });

      // Remove cookies on logout
      removeCookie("adminToken");
      removeCookie("adminUser");

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Logout failed" }
      );
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/users/me");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to get current user" }
      );
    }
  }
);

// Synchronous function to verify login status from cookies
export const verifyLoginFromCookies = () => (dispatch) => {
  try {
    const token = getCookie("adminToken");
    const userData = getCookie("adminUser", true);

    console.log("Checking cookies for authentication:", {
      hasToken: !!token,
      hasUserData: !!userData,
      userRole: userData?.role,
    });

    if (token && userData && userData.role === "admin") {
      dispatch(setUser(userData));
      return true;
    } else {
      dispatch(clearUser());
      return false;
    }
  } catch (error) {
    console.error("Error verifying login from cookies:", error);
    dispatch(clearUser());
    return false;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthStatus(state) {
      state.status = "idle";
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload.user) {
          state.status = "succeeded";
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.loading = false; // Explicitly set loading to false
          console.log("Login successful, state updated:", {
            isAuthenticated: state.isAuthenticated,
            user: state.user,
          });
        } else {
          state.status = "failed";
          state.error = "Invalid response from server";
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login failed";
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.status = "idle";
        state.isAuthenticated = false;
      });
  },
});

export const { resetAuthStatus, setUser, clearUser, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
