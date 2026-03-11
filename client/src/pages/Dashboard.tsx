import { Outlet } from "react-router";
import ProtectedRoute from "../routes/ProtectedRoute";
import Nav from "../components/Nav";

export default function Dashboard() {


  return (
    <div className="w-full max-w-sm">
      <ProtectedRoute>
        <Outlet />
        <Nav />
      </ProtectedRoute>
    </div>
  )
}