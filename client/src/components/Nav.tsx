import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/fetch";
import { toast } from "sonner";
import { ApiError } from "@/types";
import { Button } from "./ui/button";

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

  const navLinkClass = ({ isActive }:{isActive: boolean}) => {
    return `hover:text-primary ${ isActive ? "text-blue-600 underline" : ""}`
  }

  return (
    <nav>
      <div className="w-full justify-center  flex fixed p-5 left-50 top-0 -translate-x-50 gap-10 bg-white">
        <button onClick={() => navigate('/dashboard/create-post')}>Create Post</button>
        <button onClick={handleLogout}>Logout</button>
      </div> 
      <div className="w-full justify-center  flex fixed p-5 left-50 bottom-0 -translate-x-50 gap-10 bg-white">
        <Button variant="link">
          <NavLink to="/dashboard" end className={navLinkClass}>Following</NavLink>
        </Button>
        <Button variant="link">
          <NavLink to="/dashboard/discover" className={navLinkClass}>Discover</NavLink>
        </Button>
        <Button variant="link">
          <NavLink to={`/dashboard/profile/${user?.username}`} className={navLinkClass}>Profile</NavLink>
        </Button>
      </div>
    </nav> 
  )
}