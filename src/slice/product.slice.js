import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequests from "../services/Api.services";
import checkStatus from "../config/CheckStatus";

export const addProduct = createAsyncThunk("product/create", async (data) => {
  const { response, status } = await ApiRequests?.addProduct(data);
  return { res: response, status };
});

export const getProducts = createAsyncThunk("products/getStore", async () => {
  const { response, status } = await ApiRequests?.getProducts();
  return { res: response, status };
});

const initialState = {
  products: [],
  success: { bool: false, type: null },
  loading: { bool: true, message: "", full: false },
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: (builder) =>
    builder
      .addCase(addProduct.pending, (state, _) => {
        state.loading = { bool: true, full: true, message: "Adding Product" };
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = { bool: false, ...state.loading };
        const isError = checkStatus(action.payload.status);

        if (isError) {
          state.error = action.payload.res.message;
          state.success = { bool: false, ...state.success };
        } else {
          state.products = action.payload.res.products;
          state.success = { bool: true, type: "create" };
          state.error = null;
        }
      })
      .addCase(addProduct.rejected, (state, _) => {
        state.loading = { bool: false, ...state.loading };
      })

      .addCase(getProducts.pending, (state, _) => {
        state.loading = {
          bool: true,
          full: false,
          message: "Fetching Product",
        };
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = {
          ...state.loading,
          bool: false,
        };
        const isError = checkStatus(action.payload.status);

        if (isError) {
          state.error = action.payload.res.message;
          state.success = { bool: false, ...state.success };
        } else {
          state.products = action.payload.res.products;
          state.success = { bool: true, type: "get" };
          state.error = null;
        }
      })
      .addCase(getProducts.rejected, (state, _) => {
        state.loading = { bool: false, ...state.loading };
      }),
});

export const {} = productSlice.actions;
export default productSlice.reducer;
