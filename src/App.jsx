import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { useRefreshUserMutation } from "./api/UserApi";
import { useEffect } from "react";
import { authChecked } from "./slice/authSlice";
import { extractErrorMessage } from "./utils/common";

function App() {
  const dispatch = useDispatch();
  const [refreshUser] = useRefreshUserMutation();
  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshUser().unwrap();
      } catch(error) {
        console.log(extractErrorMessage(error))
        dispatch(authChecked());
      }
    };

    initAuth();
  }, []);
  return (
    <>
      <Outlet></Outlet>
      <Toaster position="bottom-left" />
    </>
  );
}

export default App;
