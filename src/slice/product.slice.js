import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiRequests from "../services/Api.services";
import checkStatus from "../config/CheckStatus";

export const addProduct = createAsyncThunk(
  "product/create",
  async ({ data, storeId, callBack }) => {
    const { response, status } = await ApiRequests?.addProduct(data, storeId);

    if (callBack) await callBack();

    return { res: response, status };
  }
);

export const getProductsForAdmin = createAsyncThunk(
  "products/getForStore",
  async ({ storeId, callBack, page, limit }) => {
    const { response, status } = await ApiRequests?.getProductsForAdmin(
      storeId,
      page,
      limit
    );
    if (callBack) await callBack();
    return { res: response, status };
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ storeId, productId, callBack }) => {
    const { response, status } = await ApiRequests?.deleteProduct(
      storeId,
      productId
    );
    if (callBack) await callBack();
    return { res: response, status };
  }
);

const initialState = {
  products: [],
  success: { bool: false, type: null },
  loading: { bool: true, message: "", full: false },
  error: null,
  totalProducts: null,
  reveniue: null,
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
          state.totalProducts = action.payload.res.totalProducts;
          state.reveniue = action.payload.res.reveniue;
          state.success = { bool: true, type: "get" };
          state.error = null;
        }
      })
      .addCase(getProductsForAdmin.rejected, (state, _) => {
        state.loading = { ...state.loading, bool: false };
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
