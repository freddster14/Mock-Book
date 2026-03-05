import { useAuth } from "@/context/AuthContext";
import { NavLink, useLoaderData } from "react-router";
import { Follower, Following, UserRes } from "shared-types";
import Follow from "./Follow";

export default function Connections() {
  const { user } = useAuth()
  const res = useLoaderData();
  const users: Follower[] | Following[] = res.data

  return (
    <div>
      {users.length > 0
      ? users.map(u => (
        <div key={u.userId}>
          <NavLink to={`/dashboard/profile/${u.username}`}>
            {u.avatarUrl ? <img src={u.avatarUrl} /> : <div>{u.username[0]}</div>}
          </NavLink>
          <NavLink to={`/dashboard/profile/${u.username}`}>
            <p>Author: {u.username}</p>
          </NavLink>
          {user?.userId !== u.userId && <Follow recipientId={u.userId}/>}
        </div>
      ))
      : <p>No Users</p>
      }
    </div>
  )
}