import { Navigate } from "react-router-dom";
import useAuthenticated from "./utility/useAuthenticate";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthenticated();

  if (!isAuthenticated) {
    // If not logged in, redirect to login page
    return <Navigate to="/auth" replace />;
  }

  // If logged in, render the component
  return children;
};

export default ProtectedRoute;
