import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../api/fetch";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { ApiError } from "@/types";

export default function Like({ likeCount, postId }: { likeCount: number, postId: number } ) {
  const timerRef = useRef<null | number>(null)
  const [ likeStatus, setLikeStatus ] = useState<boolean | null>(null)
  const [ count, setCount ] = useState(likeCount)

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

  return (
    <>
      { likeStatus === null ? <Spinner />
      : <p><Button onClick={handleLike}>{likeStatus ? "Unlike" : "Like"}</Button> {count}</p>
      }
    </>
  )
}