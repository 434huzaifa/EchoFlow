import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useRefreshUserMutation } from "./api/UserApi";
import { useEffect } from "react";
import { authChecked } from "./slice/authSlice";
import { extractErrorMessage } from "./utils/common";
import { initializeSocket, updateSocketAuth } from "./config/socketConfig";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refreshUser] = useRefreshUserMutation();
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshUser().unwrap();
      } catch (error) {
        console.log(extractErrorMessage(error));
        dispatch(authChecked());
        if (error?.status == "401") {
          navigate("/login");
        }
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (accessToken) {
      initializeSocket(accessToken);
    } else {
      updateSocketAuth(null);
    }
  }, [accessToken]);

  return (
    <div className="my-bg">
      <Outlet></Outlet>
      <Toaster position="bottom-left" />
    </div>
  );
}

export default App;
