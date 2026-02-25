import { createBrowserRouter } from "react-router";
import App from "../pages/App";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
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
