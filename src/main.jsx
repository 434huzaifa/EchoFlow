import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';

let router = createBrowserRouter([
  {
    path: "/",
    Component: App ,
  },
  {
    path:"home",
    Component:Home
  },
  {
    path:"login",
    Component:Login
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
