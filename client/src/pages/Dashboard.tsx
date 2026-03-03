import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { apiFetch } from "../api/fetch";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../routes/ProtectedRoute";
import Nav from "../components/Nav";

export default function Dashboard() {


  return (
    <div>
      <ProtectedRoute>
        
        <Outlet />
        <Nav />
      </ProtectedRoute>
    </div>
  )
}