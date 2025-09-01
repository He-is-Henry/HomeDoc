import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = () => {
  const location = useLocation();
  const { accessToken, loading } = useAuth();
  return loading ? (
    <p>Checking user's access</p>
  ) : accessToken ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace state={{ location }} />
  );
};

export default RequireAuth;
