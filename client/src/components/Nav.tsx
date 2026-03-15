import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/fetch";
import { toast } from "sonner";
import { ApiError } from "@/types";

export default function Nav() {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiFetch('/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      if (error instanceof ApiError) {
        toast(error.msg)
      } else {
        toast("Something went wrong, try again")
      }
    }
  }
  console.log(user)
  return (
    <nav>
      <div className="w-full justify-center  flex fixed p-5 left-50 top-0 -translate-x-50 gap-10 bg-white">
        <button onClick={() => navigate('/dashboard/create-post')}>Create Post</button>
        <button onClick={handleLogout}>Logout</button>
      </div> 
      <div className="w-full justify-center  flex fixed p-5 left-50 bottom-0 -translate-x-50 gap-10 bg-white">
        <NavLink
        to="/dashboard"
        className={({ isActive, isPending }) => 
          isPending ? "pending" : isActive ? "active" : ""
        }>Following</NavLink>
        <NavLink to="/dashboard/discover">Discover</NavLink>
        <NavLink to={`/dashboard/profile/${user?.username}`}>Profile</NavLink>
      </div>
    </nav> 
  )
}