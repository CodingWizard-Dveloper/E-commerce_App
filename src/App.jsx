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
  const { loading, token } = useSelector((state) => state.auth);
  const { loading: storeLoading } = useSelector((state) => state.store);

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(getStore());
  }, [dispatch, token]);

  
  if (
    (loading.bool && loading.full) ||
    (storeLoading.bool && storeLoading.full)
  ) {
    return <Loader message={loading.message} />;
  }

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
