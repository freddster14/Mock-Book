import { Link, NavLink, Outlet, useLoaderData, useLocation, useOutletContext } from "react-router";
import { PostsRes, ProfileRes } from "shared-types";
import Follow from "../components/Follow";
import { useAuth } from "@/context/AuthContext";
import { Virtuoso } from "react-virtuoso";
import Post from "@/components/Post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/api/fetch";
import { ApiError } from "@/types";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { user } = useAuth();
  const res = useLoaderData();
  const currUser: ProfileRes = res.data;


  const navLinkClass = ({ isActive }:{isActive: boolean}) => {
    return `hover:text-primary ${ isActive ? "text-blue-600 underline" : ""}`
  }
  return (
    <div>
      <div className="flex gap-4">
        <Avatar className="w-[20vw] h-[20vw] max-w-38 max-h-38 aspect-square">
          {currUser.avatarUrl
            ? <AvatarImage src={currUser.avatarUrl} />
            : (
                <AvatarFallback className="w-full h-full aspect-square flex items-center justify-center text-2xl md:text-4xl">
                  {currUser.username[0]}
                </AvatarFallback>
              )
          }
        </Avatar>
        <div className="flex flex-col gap-5">
          <p className="text-xl pl-1 pt-1">{currUser.username}</p>
          <div className="flex gap-3">
            <p>Posts {currUser.posts.length}</p>
            <Link to={`/dashboard/connections/${currUser.username}/followers`}>Followers {currUser._count.followers}</Link>
            <Link to={`/dashboard/connections/${currUser.username}/following`}>Following {currUser._count.following}</Link>
          </div>
          { user?.userId === currUser.id && <NavLink to={`/dashboard/profile/edit/${user.username}`}><Button className="w-full">Edit</Button></NavLink>}
          {user?.userId !== currUser.id && <Follow recipientId={currUser.id} />}
        </div>
      </div>
      <p>{currUser.bio}</p>
      <div className="text-center">
      <Button variant="link">
        <NavLink
          to={`/dashboard/profile/${currUser.username}`}
          end
          className={navLinkClass}
        >
          Posts
        </NavLink>
      </Button>
      <Button variant="link">
        <NavLink
          to={`/dashboard/profile/${currUser.username}/likes`}
          end
          className={navLinkClass}
        >
          Likes
        </NavLink>
      </Button>
      </div>
      <Separator className="mb-3"/>
      <div>
        <Outlet context={currUser}/>
      </div>
    </div>
  );
}

export function ProfilePosts() {
  const { user } = useAuth();
  const currUser = useOutletContext<ProfileRes>()
  const res = useLoaderData()
  const [ posts, setPosts ] = useState<PostsRes[]>(res.data) 
  const [ error, setError ] = useState(false)
  const [ isFetchingMore, setIsFetchMore ] = useState(false);
  const allLoaded = useRef(false)
  const { pathname } = useLocation();
  const isLikesPage = pathname.endsWith('likes');


  useEffect(() => {
    setPosts(res.data)
    if(res.data.length < 6) allLoaded.current = true
  }, [res])

  const loadMore = async () => {
    setError(false);
    if (isFetchingMore || allLoaded.current) return;
    setIsFetchMore(true);
    const cursor = posts[posts.length - 1].id
    try {
      let res;
      if (isLikesPage) {
        res = await apiFetch(`/likes/${currUser.username}/?cursor=${cursor}`)
      } else {
        res = await apiFetch(`/posts/${currUser.username}/?cursor=${cursor}`)
      }
      if (res.data && res.data.length > 0) {
        setPosts(prev => [...prev, ...res.data])
      } else {
        allLoaded.current = true;
      }
    } catch (error) {
      setError(true)
      if(error instanceof ApiError) {
        toast(error.msg)
      } else {
        toast("Something went wrong, try again")
      }
      allLoaded.current = true
    } finally {
      setIsFetchMore(false)
    }
  }

  return (
    <>
     {posts.length > 0 ? 
      <Virtuoso
      style={{ height: "60dvh", width: "100%" }}
      data={posts}
      endReached={loadMore}
      useWindowScroll={true}
      atBottomThreshold={300}
      itemContent={i => (
        <div>
          <Post post={posts[i]} />
          <Separator className="mt-3 mb-3" />
        </div>
      )}
      components={{
        Footer: () => (
          <div
            style={{
              padding: "1rem",
              paddingBottom: "100px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            { isFetchingMore && !allLoaded.current ? "Loading..." : !error ? "No more posts." : ""}
          </div>
        )
      }}
      />
      : user?.userId === currUser.id
      ? <p>Create your first post. <Link to={`/dashboard/create-post`}><Button>Create</Button></Link></p>
      : <p>No Posts Yet</p>
    }
    </>
  )
}
