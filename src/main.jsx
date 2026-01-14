import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
let router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "login",
    Component: Login,
  },
  {
    path: "signup",
    Component: Signup,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
