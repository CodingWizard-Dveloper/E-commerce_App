import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequests from "../services/Api.services";
import checkStatus from "../config/CheckStatus";

export const addProduct = createAsyncThunk(
  "product/create",
  async ({ data, storeId }) => {
    const { response, status } = await ApiRequests?.addProduct(data, storeId);
    return { res: response, status };
  }
);

export const getProductsForAdmin = createAsyncThunk(
  "products/getForStore",
  async ({ storeId }) => {
    const { response, status } = await ApiRequests?.getProductsForAdmin(
      storeId
    );
    return { res: response, status };
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ storeId, productId }) => {
    const { response, status } = await ApiRequests?.deleteProduct(
      storeId,
      productId
    );
    return { res: response, status };
  }
);

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
        state.loading = { ...state.loading, bool: false };
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
        state.loading = { ...state.loading, bool: false };
      })

      .addCase(getProductsForAdmin.pending, (state, _) => {
        state.loading = {
          bool: true,
          full: false,
          message: "Fetching Product",
        };
      })
      .addCase(getProductsForAdmin.fulfilled, (state, action) => {
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
      .addCase(getProductsForAdmin.rejected, (state, _) => {
        state.loading = { bool: false, ...state.loading };
      })

      .addCase(deleteProduct.pending, (state, _) => {
        state.loading = {
          bool: true,
          full: false,
          message: "Deleting Product",
        };
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = {
          ...state.loading,
          bool: false,
        };
        const isError = checkStatus(action.payload.status);

        if (isError) {
          state.error = action.payload.res.message;
          state.success = { ...state.success, bool: false };
        } else {
          state.products = action.payload.res.products;
          state.success = { bool: true, type: "delete" };
          state.error = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, _) => {
        state.loading = { ...state.loading, bool: false };
      }),
});

export const {} = productSlice.actions;
export default productSlice.reducer;
