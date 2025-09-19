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

export const changeUser = createAsyncThunk(
  "Auth/changeUser",
  async ({ data }) => {
    const { response, status } = await ApiRequests.changeUser(data);

    return { res: response.data, status };
  }
);

const initialState = {
  user: null,
  loading: { bool: true, message: "", full: true },
  error: null,
  token: null,
  justSignedUp: false,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = { bool: false, message: "" };
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
    resetSignupFlag: (state) => {
      state.justSignedUp = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state, _) => {
        state.loading = { bool: true, message: "Checking Auth", full: true };
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        let isErrorStatus = false;

        state.loading = { ...state.loading, bool: false, full: false };
        if (action.payload.status !== 401) {
          isErrorStatus = checkStatus(action.payload.status);
        }

        if (!isErrorStatus) {
          // Authentication successful
          state.success = false;
          state.user = action.payload.res.user;
          state.error = state.error;
        } else {
          // Authentication failed
          state.user = null;
          state.error = action.payload.res.message || "Authentication failed";
          state.justSignedUp = false;
          state.success = true;
          // Clear token from localStorage if auth check fails
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      })
      .addCase(checkAuth.rejected, (state, _) => {
        state.loading = { ...state, bool: false };
      })

      .addCase(login.pending, (state) => {
        state.loading = { bool: true, message: "Loging In", full: true };
      })
      .addCase(login.fulfilled, (state, action) => {
        const isError = checkStatus(action.payload.status);
        state.loading = { ...state.loading, bool: false };

        if (!isError && action.payload.res.token) {
          // Login successful
          state.success = true;
          state.user = action.payload.res.user;
          state.error = null;
          state.token = action.payload.res.token;
          state.justSignedUp = false; // Reset signup flag for login
          localStorage.setItem("token", action.payload.res.token);
          // Store refresh token if provided
          if (action.payload.res.refreshToken) {
            localStorage.setItem(
              "refreshToken",
              action.payload.res.refreshToken
            );
          }
        } else {
          // Login failed
          state.success = false;
          state.error = action.payload.res.message || "Login failed";
        }
      })

      .addCase(signup.pending, (state) => {
        state.loading = { bool: true, message: "Creating User", full: true };
      })
      .addCase(signup.fulfilled, (state, action) => {
        const isError = checkStatus(action.payload.status);
        state.loading = { ...state.loading, bool: false };
        state.justSignedUp = true;

        if (!isError && action.payload.res.token) {
          // Signup successful
          state.user = action.payload.res.user;
          state.error = null;
          state.token = action.payload.res.token;
          localStorage.setItem("token", action.payload.res.token);
          state.success = true;
        } else {
          // Signup failed
          state.success = false;
          state.error = action.payload.res.message || "Signup failed";
        }
      })

      .addCase(changeUser.pending, (state, _) => {
        state.loading = { bool: true, message: "Updating user", full: false };
      })
      .addCase(changeUser.fulfilled, (state, action) => {
        state.loading = { ...state.loading, bool: false };
        const isError = checkStatus(action.payload.status);

        if (!isError) {
          state.success = true;
          state.error = null;
          state.user = action.payload.res.user;
        } else {
          state.success = false;
          state.error = action.payload.res.message || "Data change failed";
        }
      });
  },
});

export const { logout, resetSignupFlag } = authSlice.actions;
export default authSlice.reducer;
