import { useEffect, useState } from "react";
import { apiFetch } from "../api/fetch";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export default function Follow({ recipientId } : { recipientId : number}) {
  const [ following, setFollowing ] = useState< boolean | null>(null);
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  useEffect(() => {
    const followingStatus = async () => {
      const res = await apiFetch(`/connections/status/${recipientId}`)
      if (res.success) {
        if (res.data.status === "following") setFollowing(true)
        else setFollowing(false)
      } else {
        setFollowing(null)
      }
    }
    followingStatus()
  }, [])

  const followUser = async () => {
    setIsSubmitting(true);
    setFollowing(prev => !prev)
    try {
      if (!following) {
        await apiFetch(`/connections/follow/${recipientId}`, { method: "POST" });

      } else {
        await apiFetch(`/connections/unfollow/${recipientId}`, { method: "DELETE" });
      }
    } catch {
      setFollowing(prev => !prev)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
     { following === null
      ? <Spinner className="mr-5"/>
      : <Button size="sm" disabled={isSubmitting} onClick={followUser}>{following ? "Following" : "Follow"}</Button>


    }
    </>
   
  )
}