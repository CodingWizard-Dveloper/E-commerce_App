import { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./slice/auth.slice";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Loader from "./components/ui/Loader";
import AppRoutes from "./Routes";
import { ToastContainer } from "react-toastify";

import { GuestRoute, PrivateRoute } from "./config/restrictRoute";
import Layout from "./components/layout";
import Home from "./pages/Home";
import { getStore } from "./slice/store.slice";

export default function App() {
  const dispatch = useDispatch();
  const { loading: userLoading, token } = useSelector((state) => state.auth);
  const { loading: storeLoading } = useSelector((state) => state.store);
  const { loading: productLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(getStore());
  }, [dispatch, token]);

  const showLoader = (message) => {
    return (
      <div
        style={{ height: "100lvh", width: "100lvw" }}
        className="flex align-middle justify-center"
      >
        <Loader message={message} />
      </div>
    );
  };

  if (storeLoading.bool && storeLoading.full)
    return showLoader(storeLoading?.message);
  else if (userLoading.bool && userLoading.full) return showLoader(userLoading?.message);
  else if (productLoading.bool && productLoading.full)
    return showLoader(productLoading?.message);

  return (
    <Layout>
      <ToastContainer />
      <Routes>
        <Route index element={<Home />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AppRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
