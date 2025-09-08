import { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./slice/auth.slice";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Loader from "./components/ui/Loader";
import AppRoutes from "./Routes";

import { GuestRoute, PrivateRoute } from "./config/restrictRoute";
import Layout from "./components/layout";

export default function App() {
  const dispatch = useDispatch();
  const { loading, token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch, token]);

  if (loading.bool) {
    return <Loader message={loading.message} />;
  }

  return (
    <Layout>
      <Routes>
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
