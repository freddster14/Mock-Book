import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default  function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  console.log(loading, user)
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/sign-in" />;

  return (children);
}