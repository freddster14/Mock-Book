import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/fetch";

export default function Nav() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiFetch('/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <nav>
          <div>
            <button onClick={() => navigate('/create-post')}>Create Post</button>
            <button onClick={handleLogout}>Logout</button>
          </div> 
          <div>
            <NavLink
            to="/dashboard"
            className={({ isActive, isPending }) => 
              isPending ? "pending" : isActive ? "active" : ""
            }>Following</NavLink>
            <NavLink to="/dashboard/discover">Discover</NavLink>
          </div>
        </nav> 
  )
}