import { createBrowserRouter } from "react-router";
import App from "../pages/App";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashboard";
import CreatePostForm from "../components/CreatePostForm";
import FollowingPosts from "../pages/FollowingPosts";
import DiscoverPosts from "../pages/DiscoverPosts";
import Profile, { UserPosts } from "../pages/Profile";
import { apiFetch } from "../api/fetch";
import Error from "@/pages/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
    ErrorBoundary: Error,
    children: [
      {
        index: true,
        Component: FollowingPosts
      },
      {
        path: "discover",
        Component: DiscoverPosts
      },
      {
        path: "profile/:user",
        Component: Profile,
        loader: async ({ params }) => await apiFetch(`/users/${params.user}`),
        
      },
      {
        path: "profile/:user/posts/:userId",
        Component: UserPosts,
        loader: async ({ params }) => await apiFetch(`/posts/${params.userId}`),
      },
      {
        path: "create-post",
        Component: CreatePostForm,
      },
    ]
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
