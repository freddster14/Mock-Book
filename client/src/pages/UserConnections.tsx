import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink, Outlet, useParams } from "react-router";

export default function UserConnection() {
  const { username } = useParams();

  const navLinkClass = ({ isActive }:{isActive: boolean}) => {
    return `hover:text-primary ${ isActive ? "text-blue-600 underline" : ""}`
  }

  return (
    <div className="flex flex-col mt-6">
      <NavLink to={`/dashboard/profile/${username}`}>{"<- " + username}</NavLink>
      <div className="flex justify-center gap-5">
        <Button variant="link">
          <NavLink className={navLinkClass} to={`/dashboard/connections/${username}/followers`}>Followers</NavLink>
        </Button>
        <Button variant="link">
          <NavLink className={navLinkClass} to={`/dashboard/connections/${username}/following`}>Following</NavLink>
        </Button>
        {/* <NavLink to={`/connections/${username}/mutuals`}>Mutuals</NavLink> */}
      </div>
      <Separator className="mt-2 mb-3" />
      <Outlet />
    </div>
  )
}