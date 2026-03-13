import { useAuth } from "@/context/AuthContext";
import { NavLink, useLoaderData, useLocation, useParams } from "react-router";
import { Follower, Following } from "shared-types";
import Follow from "./Follow";
import Remove from "./RemoveFollowers";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Connections() {
  const { user } = useAuth()
  const { username } = useParams();
  const { pathname } = useLocation();
  const res = useLoaderData();
  const users: Follower[] | Following[] = res.data
  const isFollowersPage = pathname.endsWith('followers');


  return (
    <div className="flex flex-col gap-5">
      {users.length > 0
      ? users.map(u => (
        <div key={u.userId} className="flex justify-between items-center">
          <NavLink to={`/dashboard/profile/${u.username}`} className="flex items-center gap-3">
             <Avatar size="lg">
              {u.avatarUrl
                ? <AvatarImage  src={u.avatarUrl} />
                : <AvatarFallback >{u.username[0]}</AvatarFallback>
              }
            </Avatar>
            <p>{u.username}</p>
          </NavLink>
          <div>
            {user?.userId !== u.userId && <Follow recipientId={u.userId}/>}
            {username === user?.username && isFollowersPage && <Remove recipientId={u.userId}/>  }
          </div>
        </div>
      ))
      : <p>No Users</p>
      }
    </div>
  )
}