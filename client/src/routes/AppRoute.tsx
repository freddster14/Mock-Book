import { createBrowserRouter } from "react-router";
import App from "../pages/App";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/dashboard",
    Component: Dashboard
  },
  {
    path: "/sign-up",
    Component: SignUp,
  },
  {
    path: "/sign-in",
    Component: SignIn,
  }
]);
