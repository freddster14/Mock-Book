import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../api/fetch";

export default function Like({ likeCount, postId }: { likeCount: number, postId: number } ) {
  const timerRef = useRef<null | number>(null)
  const [ likeStatus, setLikeStatus ] = useState(false) // Add feature where like is tracked on post
  const [ count, setCount ] = useState(likeCount)


  const handleLike = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const prevCount = count;
    // Immediatly show change
    if (!likeStatus) {
      setLikeStatus(true);
      setCount(prev => prev + 1)
    } else {
      setLikeStatus(false);
      setCount(prev => prev - 1)
    }
    // Delay to fully submit/remove the like
    timerRef.current = setTimeout( async () => {
      if(!likeStatus) {
        const res = await apiFetch(`/likes/${postId}`, { method: "POST" })
        console.log(res)
        if(!res.success) {
          setLikeStatus(false);
          setCount(prevCount)
        }
      } else {
        const res = await apiFetch(`/likes/${postId}`, { method: "DELETE" })
        if (!res.success) {
          setLikeStatus(true)
          setCount(prevCount)
        }
      }
    }, 1000);
  }
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [])

  return (
    <p><button onClick={handleLike}>{likeStatus ? "Unlike" : "Like"}</button> {count}</p>
  )
}