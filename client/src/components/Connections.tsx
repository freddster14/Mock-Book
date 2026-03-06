import { useAuth } from "@/context/AuthContext";
import { NavLink, useLoaderData, useLocation, useParams } from "react-router";
import { Follower, Following } from "shared-types";
import Follow from "./Follow";
import Remove from "./RemoveFollowers";

export default function Connections() {
  const { user } = useAuth()
  const { username } = useParams();
  const { pathname } = useLocation();
  const res = useLoaderData();
  const users: Follower[] | Following[] = res.data
  const isFollowersPage = pathname.endsWith('followers');


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
          {username === user?.username && isFollowersPage && <Remove recipientId={u.userId}/>  }
        </div>
      ))
      : <p>No Users</p>
      }
    </div>
  )
}