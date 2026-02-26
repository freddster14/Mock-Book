import { apiFetch } from "../api/fetch";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../routes/ProtectedRoute";

export default function Dashboard() {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await apiFetch('/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <ProtectedRoute>
        <nav>
          <p>Hello: {user?.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </nav>
        <h1>Dashboard</h1>
      </ProtectedRoute>
    </div>
  )
}