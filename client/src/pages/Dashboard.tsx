import { Outlet } from "react-router";
import ProtectedRoute from "../routes/ProtectedRoute";
import Nav from "../components/Nav";
import { Toaster } from "sonner";

export default function Dashboard() {

  return (
    <div className="w-full max-w-sm mt-8">
      <ProtectedRoute>
        <Outlet />
        <Nav />
        <Toaster position="top-center" toastOptions={{ classNames: { toast: '!bg-red-400', title: '!text-white'}}}/>
      </ProtectedRoute>
    </div>
  )
}