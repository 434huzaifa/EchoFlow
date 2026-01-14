import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.info("🚀 ~ PrivateRoute ~ user:", user);
  console.info("🚀 ~ PrivateRoute ~ isAuthenticated:", isAuthenticated);
  if (!isAuthenticated) {
    toast.error("User not authenticated");
    return <Navigate to="login"></Navigate>
  } else {
    return children;
  }
}

export default PrivateRoute;
