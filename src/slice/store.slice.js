import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequests from "../services/Api.services";
import checkStatus from "../config/CheckStatus";

export const createStore = createAsyncThunk(
  "Store/CreateStore",
  async ({ data }) => {
    const { response, status } = await ApiRequests.createStore(data);

    return { res: response.data, status };
  }
);

export const deleteStore = createAsyncThunk(
  "Store/DeleteStore",
  async (data) => {
    const { response, status } = await ApiRequests.deleteStore({
      storeId: data.storeId,
    });

    if (data.callBack && response) data.callBack();

    return { res: response.data, status };
  }
);

export const updateStore = createAsyncThunk(
  "Store/updateStore",
  async ({ data }) => {
    const { response, status } = await ApiRequests.updateStore(data);

    return { res: response.data, status };
  }
);

export const getStore = createAsyncThunk("store/getStore", async () => {
  const { response, status } = await ApiRequests.getStore();

  return { res: response.data, status };
});

const initialState = {
  loading: { bool: false, message: "", full: true },
  store: null,
  error: null,
  success: { bool: null, type: null },
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  extraReducers: (builder) =>
    builder
      .addCase(getStore.pending, (state, _) => {
        state.loading = { bool: true, message: "Checking Store", full: false };
      })
      .addCase(getStore.fulfilled, (state, action) => {
        state.loading = { ...state.loading, bool: false, full: false };
        const isError = checkStatus(action.payload.status);

        if (!isError) {
          state.success = { bool: true, type: "get" };
          state.store = action.payload.res.store;
          state.error = null;
        } else {
          state.success = { type: "get", bool: false };
          state.error = action.payload.res.message || "Failed checking store";
        }
      })
      .addCase(getStore.rejected, (state, _) => {
        state.loading = { ...state.loading, bool: false };
      })

      .addCase(createStore.pending, (state, action) => {
        state.loading = { bool: true, message: "Creating Store", full: true };
      })
      .addCase(createStore.fulfilled, (state, action) => {
        const isError = checkStatus(action.payload.status);
        state.loading = { ...state.loading, bool: false };

        if (!isError) {
          state.success = { type: "create", bool: true };
          state.user = action.payload.res.user;
          state.error = null;
        } else {
          state.success = { type: "create", bool: false };
          state.error = action.payload.res.message || "Signup failed";
        }
      })
      .addCase(createStore.rejected, (state, _) => {
        state.loading = { ...state.loading, bool: false };
      })

      .addCase(deleteStore.pending, (state, _) => {
        state.loading = { bool: true, message: "Deleting store" };
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading = { ...state.loading, bool: false };
        const isError = checkStatus(action.payload.status);

        if (!isError) {
          state.error = null;
          state.success = { type: "delete", bool: true };
        } else {
          state.error = action.payload.res.message || "Error deleting store";
          state.success = { bool: false, type: "delete" };
        }
      })
      .addCase(deleteStore.rejected, (state, _) => {
        state.loading = { ...state.loading, bool: false };
      })

      .addCase(updateStore.pending, (state, _) => {
        state.loading = { bool: true, message: "Updating store", full: false };
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = { ...state.loading, bool: false };

        const isError = checkStatus(action.payload.status);

        if (!isError) {
          state.error = null;
          state.success = { type: "update", bool: true };
          state.user = action.payload.res.user;
        } else {
          state.error = action.payload.res.message || "Error Updating store";
          state.success = { bool: false, type: "update" };
        }
      })
      .addCase(updateStore.rejected, (state, _) => {
        state.loading = { ...state.loading, bool: false };
      }),
});

export const {} = storeSlice.actions;
export default storeSlice.reducer;
