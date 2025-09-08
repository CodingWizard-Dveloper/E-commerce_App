import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import CreateStore from "./pages/CreateStore";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Routes>
      {user?.storeId ? (
        <Route path="/createstore" element={<Navigate to="/" replace />} />
      ) : (
        <Route path="/createstore" element={<CreateStore />} />
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
