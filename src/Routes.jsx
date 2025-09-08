import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./components/NotFound";
import CreateStore from "./pages/CreateStore";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile"

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Routes>
      <Route path="/profile" element={<Profile />} />
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
