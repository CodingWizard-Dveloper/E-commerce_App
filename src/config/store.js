import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/auth.slice";
import storeSlice from "../slice/store.slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    store: storeSlice,
  },
});
