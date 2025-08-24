import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

export function GuestRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading.bool) {
    return <Loader message={loading.message} />;
  }

  return !user ? children : <Navigate to="/" replace />;
}

export function PrivateRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading.bool) {
    return <Loader message={loading.message} />;
  }

  return user
    ? children
    : <Navigate to="/login" replace /> || <Navigate to="/signup" replace />;
}
