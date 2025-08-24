import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequests from "../services/Api.services";
import checkStatus from "../config/CheckStatus";

export const checkAuth = createAsyncThunk("Auth/checkAuth", async () => {
  const { response, status } = await ApiRequests.checkAuth();

  return { res: response.data, status };
});

export const login = createAsyncThunk("Auth/login", async ({ data }) => {
  const { response, status } = await ApiRequests.login({ ...data });

  return { res: response.data, status };
});

export const signup = createAsyncThunk("Auth/singup", async ({ data }) => {
  const { response, status } = await ApiRequests.signup(data);

  return { res: response.data, status };
});

const initialState = {
  user: null,
  loading: { bool: false, message: "" },
  error: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state, _) => {
        state.loading = { bool: true, message: "Checking Auth" };
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        let isErrorStatus = false;

        if (action.payload.status !== 401) {
          isErrorStatus = checkStatus(action.payload.status);
        }

        if (!isErrorStatus) {
          // Authentication successful
          state.user = action.payload.res.user;
          state.error = state.error;
        } else {
          // Authentication failed
          state.user = null;
          state.error = action.payload.res.message || "Authentication failed";
          // Clear token from localStorage if auth check fails
          localStorage.removeItem("token");
        }

        state.loading = { ...state.loading, bool: false };
      })

      .addCase(login.pending, (state) => {
        state.loading = { bool: true, message: "Loging In" };
      })
      .addCase(login.fulfilled, (state, action) => {
        const isError = checkStatus(action.payload.status);
        state.loading = { ...state.loading, bool: false };

        if (!isError && action.payload.res.token) {
          // Login successful
          state.user = action.payload.res.user;
          state.error = null;
          state.token = action.payload.res.token;
          localStorage.setItem("token", action.payload.res.token);
        } else {
          // Login failed
          state.error = action.payload.res.message || "Login failed";
        }
      })

      .addCase(signup.pending, (state) => {
        state.loading = { bool: true, message: "Creating User" };
      })
      .addCase(signup.fulfilled, (state, action) => {
        const isError = checkStatus(action.payload.status);
        state.loading = { ...state.loading, bool: false };

        if (!isError && action.payload.res.token) {
          // Signup successful
          state.user = action.payload.res.user;
          state.error = null;
          state.token = action.payload.res.token;
          localStorage.setItem("token", action.payload.res.token);
        } else {
          // Signup failed
          state.error = action.payload.res.message || "Signup failed";
        }
      });
  },
});

export default authSlice.reducer;
