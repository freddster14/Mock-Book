import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export default  function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const location = useLocation();
  
  console.log("ran", loading, user)
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/sign-in" />;

  return (children);
}