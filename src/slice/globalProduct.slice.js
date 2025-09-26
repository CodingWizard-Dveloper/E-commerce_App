import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequests from "../services/Api.services";
import checkStatus from "../config/CheckStatus";

export const getAllProducts = createAsyncThunk(
  "globalProducts/get",
  async ({ limit }) => {
    const { response, status } = await ApiRequests.getProductsAsUser(limit);

    return { res: response, status };
  }
);

const initialState = {
  products: [],
  loading: { bool: true, message: "", full: null },
  error: null,
};

const globalProductSlice = createSlice({
  name: "globalProducts",
  initialState,
  extraReducers: (builder) =>
    builder
      .addCase(getAllProducts.pending, (state, _) => {
        state.loading = {
          bool: true,
          message: "Fetching products",
          full: false,
        };
      })
      .addCase(getAllProducts.fulfilled, (state, actions) => {
        state.loading = { ...state.loading, bool: false };
        const error = checkStatus(actions.payload.status);

        if (error) {
          state.error = actions.payload.res.message ?? "Error Fetching products";
        } else {
          state.products = actions.payload.res.products;
        }
      })
      .addCase(getAllProducts.rejected, (state, _) => {
        state.loading = {
          ...state.loading,
          bool: false,
        };
        state.error = "Error fetching products";
      }),
});

export const {} = globalProductSlice?.actions;
export default globalProductSlice?.reducer;
