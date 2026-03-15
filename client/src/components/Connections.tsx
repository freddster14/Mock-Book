import { useAuth } from "@/context/AuthContext";
import { NavLink, useLoaderData, useLocation, useParams } from "react-router";
import { Follower, Following } from "shared-types";
import Follow from "./Follow";
import Remove from "./RemoveFollowers";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/api/fetch";
import { Separator } from "./ui/separator";
import { Virtuoso } from "react-virtuoso";
import { toast } from "sonner";
import { ApiError } from "@/types";

export default function Connections() {
  const { user } = useAuth()
  const { username } = useParams();
  const { pathname } = useLocation();
  const [ error, setError ] = useState(false)
  const [ isFetchingMore, setIsFetchingMore ] = useState(false) 
  const allLoaded = useRef(false)
  const res = useLoaderData();
  const [ users, setUsers ] = useState<Follower[] | Following[]>(res.data)
  const isFollowersPage = pathname.endsWith('followers');

  useEffect(() => {
    setUsers(res.data)
  }, [ res ])
  const loadMore = async () => {
    setError(false)
    // Prevent multiple triggers and loading if all posts are fetched
    if (isFetchingMore || allLoaded.current) return;
    setIsFetchingMore(true);
    const cursor = users[users.length - 1].userId
    try {
      let res;
      if (isFollowersPage) {
        res = await apiFetch(`/connections/${username}/followers/?cursor=${cursor}`);
      } else {
        res = await apiFetch(`/connections/${username}/following/?cursor=${cursor}`);
      }
      if (res.data && res.data.length > 0) {
        setUsers((prev) => [...prev, ...res.data]);
        if (res.data.length < 5) {
          // No more posts available
          allLoaded.current = true;
        }
      } else {
        allLoaded.current = true;
      }
    } catch (error) {
      setError(true)
      if (error instanceof ApiError) {
        toast(error.msg)
      } else {
        toast("Something went wrong, try again")
      }
      allLoaded.current = true;
    } finally {
      setIsFetchingMore(false);
    }

  };

  return (
    <div className="flex flex-col gap-5 mb-10">
      {users.length > 0
      ?
      <Virtuoso
        style={{ height: "100%", width: "100%" }}
        data={users}
        endReached={loadMore}
        useWindowScroll
        atBottomThreshold={300}
        itemContent={(_i, u) => (
          <>
           <div className="flex items-center">
            <NavLink to={`/dashboard/profile/${u.username}`} className="flex items-center gap-3">
              <Avatar size="lg">
                {u.avatarUrl
                  ? <AvatarImage  src={u.avatarUrl} />
                  : <AvatarFallback >{u.username[0]}</AvatarFallback>
                }
              </Avatar>
              <p>{u.username}</p>
            </NavLink>
            <div className="ml-auto">
              {user?.userId !== u.userId && <Follow recipientId={u.userId}/>}
              {username === user?.username && isFollowersPage && <Remove recipientId={u.userId}/>  }
            </div>
          </div>
          <Separator className="mt-3 mb-3" />
          </>
        )}
        components={{
          Footer: () => (
            <div
              style={{
                padding: ".7rem",
                paddingBottom: "75px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              { isFetchingMore && !allLoaded.current ? "Loading..." : !error ? "No more users." : ""}
            </div>
          )
        }}
        />
      : <p>No Users</p>
      }
    </div>
  )
}