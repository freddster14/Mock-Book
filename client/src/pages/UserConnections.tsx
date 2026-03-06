import { NavLink, Outlet, useParams } from "react-router";

export default function UserConnection() {
  const { username } = useParams();
  return (
    <div className="flex flex-col">
      <NavLink to={`/dashboard/profile/${username}`}>{"<- " + username}</NavLink>
      <NavLink to={`/dashboard/connections/${username}/followers`}>Followers</NavLink>
      <NavLink to={`/dashboard/connections/${username}/following`}>Following</NavLink>
      {/* <NavLink to={`/connections/${username}/mutuals`}>Mutuals</NavLink> */}
      <Outlet />
    </div>
  )
}