import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/fetch";

export default function Nav() {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiFetch('/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
    }
  }
  return (
    <nav>
      <div className="w-full justify-center  flex fixed p-5 left-50 top-0 -translate-x-50 gap-10">
        <button onClick={() => navigate('/dashboard/create-post')}>Create Post</button>
        <button onClick={handleLogout}>Logout</button>
      </div> 
      <div className="w-full justify-center  flex fixed p-5 left-50 bottom-0 -translate-x-50 gap-10">
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