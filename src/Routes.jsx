import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./components/NotFound";
import CreateStore from "./pages/forms/CreateStore";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import { StoreRoute } from "./config/restrictRoute";
import CreateProduct from "./pages/forms/AddProduct";
import EditProduct from "./pages/forms/EditProduct";

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Routes>
      <Route path="/profile/:tab" element={<Profile />} />
      <Route path="/profile/" element={<Profile />} />

      {user?.storeId ? (
        <Route path="/createstore" element={<Navigate to="/" replace />} />
      ) : (
        <Route path="/createstore" element={<CreateStore />} />
      )}
      <Route
        path="/addProduct"
        element={
          <StoreRoute>
            <CreateProduct />
          </StoreRoute>
        }
      />
      <Route
        path="/product/edit/:productId"
        element={
          <StoreRoute>
            <EditProduct />
          </StoreRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
