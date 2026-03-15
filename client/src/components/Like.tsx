import React, { useEffect, useRef, useState } from "react";
import { apiFetch } from "../api/fetch";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { ApiError } from "@/types";
import { Virtuoso } from "react-virtuoso";
import { NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { PostLikes } from "shared-types";

export default function Like({ likeCount, postId }: { likeCount: number, postId: number } ) {
  const timerRef = useRef<null | number>(null)
  const [ likeStatus, setLikeStatus ] = useState<boolean | null>(null)
  const [ count, setCount ] = useState(likeCount)
  const [ displayLikes, setDisplayLikes ] = useState(false)

  useEffect(() => {
    const checkLikeStatus = async () => {
      const res = await apiFetch(`/likes/status/${postId}`);
      if (res.success) {
        setLikeStatus(res.data.status === "liked");
      } else {
        setLikeStatus(null);
      }
    };
    checkLikeStatus();
  }, []);

  const handleLike = () => {
    const currentStatus = likeStatus;
    const prevCount = count;

    if (!currentStatus) {
      setLikeStatus(true);
      setCount(prev => prev + 1);
    } else {
      setLikeStatus(false);
      setCount(prev => prev - 1);
    }
    // Perform the action after short delay (debounce)
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(async () => {
      try {
        if (!currentStatus) {
          await apiFetch(`/likes/${postId}`, { method: "POST" });
        } else {
          await apiFetch(`/likes/${postId}`, { method: "DELETE" });
        }
      } catch (err) {
        if(err instanceof ApiError) {
          if (!currentStatus) {
            if(err.msg !== "Post liked already") {
              setLikeStatus(false);
              setCount(prevCount);
              toast(err.msg);
            } 
          } else {
            if (err.type !== "not_found") {
              setLikeStatus(true);
              setCount(prevCount);
              toast(err.msg);
            }
          }
        }       
      }
    }, 400); // Slightly lower debounce for better UX
  };
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [])

  const showPostsLikes = () => {
    if(count === 0) return;
    setDisplayLikes(true)
  }

  return (
    <>
      { likeStatus === null ? <Spinner />
      : <p><Button onClick={handleLike}>{likeStatus ? "Unlike" : "Like"}</Button> <button onClick={showPostsLikes}>{count}</button></p>
      }
      {displayLikes && ( 
        <>
          <div className="absolute w-100vw h-100vh background-black inset-0"></div>
          <PostLikesC postId={postId} setDisplayLikes={setDisplayLikes} />
        </>
      
      )
      }
    </>
  )
}

function PostLikesC({ postId, setDisplayLikes }: {postId: number, setDisplayLikes: React.Dispatch<React.SetStateAction<boolean>>}) {
  const [ likes, setLikes ] = useState<PostLikes[]>([]);
  const [ error, setError ] = useState<string | boolean | null>(null)
  const [ isFetchingMore, setIsFetchingMore ] = useState(false);
  const allLoaded = useRef(false)
  useEffect(() => {
    const getLikes = async () => {
      try {
        const res = await apiFetch(`/likes/${postId}`)
        setLikes(res.data)
        if (!res.data || res.data.length < 5) allLoaded.current = true;
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.msg)
        } else {
          setError("Something went wrong, try again")
        }
      }
    }
    getLikes()
  }, [])

  const loadMore = async () => {
    setError(false)
    if (isFetchingMore || allLoaded.current) return;
    setIsFetchingMore(true)

    try {
      const cursor = likes[likes.length - 1].userId
      const res = await apiFetch(`/likes/${postId}?cursor=${cursor}`)
      if(res.data && res.data.length > 0) {
        setLikes(prev => [...prev, ...res.data])
        if (res.data.length < 12) {
          allLoaded.current = true
        }
      } else {
        allLoaded.current = true
      }
    } catch (error) {
      setError(true)
      allLoaded.current = true
      if(error instanceof ApiError) {
        toast(error.msg)
      } else {
        toast("Something went wrong, try again")
      }
    } finally {
      setIsFetchingMore(false)
    }
  }

  return (
    <div className="flex flex-col fixed w-md bg-gray-100 bottom-16 left-1/2 -translate-x-1/2 z-1 p-6 pb-0 pt-4 pr-0 rounded-md">
      <div className="pr-6">
        <h1 className="text-xl text-center">Likes</h1>
        <button className="absolute text-3xl right-2 top-0 text-black" onClick={() => setDisplayLikes(false)}>&times;</button>
      </div>
      {!likes ? <p>No likes</p>
      : likes.length > 0
        ?
        <>
          <Virtuoso
            style={{ height: "45vh", width: "100%" }}
            data={likes}
            endReached={loadMore}
            atBottomThreshold={200}
            itemContent={(_i, l) => (
              <div>
                <NavLink to={`/dashboard/profile/${l.user.username}`} className="flex items-center gap-5 mb-4 mt-4 ">
                  <Avatar size="lg">
                    {l.user.avatarUrl
                      ? <AvatarImage  src={l.user.avatarUrl} />
                      : <AvatarFallback >{l.user.username[0]}</AvatarFallback>
                    }
                  </Avatar>
                  <p className="text-m">{l.user.username}</p>
                </NavLink>
                <Separator />
              </div>
            )}
            components={{
              Footer: () => (
                <div
                  style={{
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  { isFetchingMore && !allLoaded.current ? "Loading..." : !error ? "No more likes." : ""}
                </div>
              )
            }}
          />
        </>
        : !error
        ? <p>No likes yet</p>
        : <p>{typeof error === "string" && error ? error : "Could not retrieve comments try again later."}</p>
      }
    </div>
  )
}