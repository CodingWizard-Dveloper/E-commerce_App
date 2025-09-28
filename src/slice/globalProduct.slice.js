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

export const getProductById = createAsyncThunk(
  "globalProducts/getById",
  async ({ id, callBack }) => {
    const { response, status } = await ApiRequests.getProductById(id);

    if (callBack) callBack();

    return { res: response, status };
  }
);

const initialState = {
  products: [],
  product: {},
  loading: { bool: true, message: "", full: null },
  error: null,
  success: { bool: false, type: "" },
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
          state.error =
            actions.payload.res.message ?? "Error Fetching products";
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
      })

      .addCase(getProductById.pending, (state, _) => {
        state.loading = {
          bool: true,
          message: "Fetching Product",
          full: false,
        };
      })
      .addCase(getProductById.fulfilled, (state, actions) => {
        state.loading = { ...state.loading, bool: false };
        const error = checkStatus(actions.payload.status);

        if (error) {
          state.error =
            actions.payload.res.message ?? "Error Fetching products";
        } else {
          state.product = actions.payload.res.product;
          state.success = { bool: true, type: "get" };
        }
      })
      .addCase(getProductById.rejected, (state, _) => {
        state.loading = {
          ...state.loading,
          bool: false,
        };
        state.error = "Error fetching product";
        state.success = { ...state.success, bool: false };
      }),
});

export const {} = globalProductSlice?.actions;
export default globalProductSlice?.reducer;
