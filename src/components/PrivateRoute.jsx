import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spin } from "antd";

function PrivateRoute({ children }) {
  const { status } = useSelector((state) => state.auth);
  console.info("🚀 ~ PrivateRoute ~ status:", status)

  if (status === "loading") {
    return (
      <div className="h-screen w-screen">
        <Spin fullscreen></Spin>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
