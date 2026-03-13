import { Button } from "@/components/ui/button";
import { NavLink, Outlet, useParams } from "react-router";

export default function UserConnection() {
  const { username } = useParams();
  return (
    <div className="flex flex-col mt-6">
      <NavLink to={`/dashboard/profile/${username}`}>{"<- " + username}</NavLink>
      <div className="flex justify-center gap-5">
      <NavLink to={`/dashboard/connections/${username}/followers`}><Button variant="link">Followers</Button></NavLink>
      <NavLink to={`/dashboard/connections/${username}/following`}><Button variant="link">Following</Button></NavLink>
      {/* <NavLink to={`/connections/${username}/mutuals`}>Mutuals</NavLink> */}
      </div>
     
      <Outlet />
    </div>
  )
}