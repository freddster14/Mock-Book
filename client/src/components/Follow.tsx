import { useState } from "react";
import { apiFetch } from "../api/fetch";

export default function Follow({ recipientId } : { recipientId : number}) {
  const [ following, setFollowing ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false)

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
    <button disabled={isSubmitting} onClick={followUser}>{following ? "Following" : "Follow"}</button>
  )
}