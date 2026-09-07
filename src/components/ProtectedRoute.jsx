import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Wait for Firebase to determine the current user
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!currentUser) {
    return <Navigate to="/admin-login" replace />;
  }

  // The admin login already verified the role,
  // so allow the authenticated user into the dashboard.
  return children;
};

export default ProtectedRoute;
