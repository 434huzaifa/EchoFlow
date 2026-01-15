import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spin } from "antd";

function PrivateRoute({ children }) {
  const { status } = useSelector((state) => state.auth);


  if (status === "loading") {
    return <Spin fullscreen></Spin>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
