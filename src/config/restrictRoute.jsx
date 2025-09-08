import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/ui/Loader";

export function GuestRoute({ children }) {
  const { user, loading, justSignedUp } = useSelector((state) => state.auth);

  if (loading.bool) {
    return <Loader message={loading.message} />;
  }

  return !user ? (
    children
  ) : justSignedUp ? (
    <Navigate to="/createstore" />
  ) : (
    <Navigate to="/" />
  );
}

export function PrivateRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading.bool) {
    return <Loader message={loading.message} />;
  }

  return user ? children : <Navigate to="/login" />;
}
