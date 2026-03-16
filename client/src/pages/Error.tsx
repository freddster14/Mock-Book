import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/types";
import { useEffect } from "react";
import { Link, useNavigate, useRouteError } from "react-router";
import { toast } from "sonner";

export default function Error() {
  const { user } = useAuth()
  const navigate = useNavigate();
  const error = useRouteError();
  useEffect(() => {
    const wait = setTimeout(() => {
      if(error instanceof ApiError)
      toast(error.msg)
    }, 250)
    return () => clearTimeout(wait)
  })
  if (!user) {
    navigate(`/sign-in`)
  }
  if (error instanceof ApiError) {
    return (
      <>
        <Nav />
        <p className="absolute top-2/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-75">
        Apolgize something did not go as planned. Head back <Link to="/dashboard/discover"><Button className="p-0" variant="link">discover page.</Button></Link>
        </p>
      </>
    );
  }
}