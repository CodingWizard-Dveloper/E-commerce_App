import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/auth.slice";
import storeSlice from "../slice/store.slice";
import productSlice from "../slice/product.slice";
import globalProductsSlice from "../slice/globalProduct.slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    store: storeSlice,
    product: productSlice,
    globalProducts: globalProductsSlice,
  },
});
