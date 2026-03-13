import { useState } from "react";
import { apiFetch } from "@/api/fetch";

export default function RemoveFollowers({ recipientId }: { recipientId: number }) {
  const [ isRemoving, setIsRemoving ] = useState(false);
  const [ unfollowed, setUnfollowed ] = useState(false);

  const handleRemoval = async () => {
    setIsRemoving(true);
    try {
      await apiFetch(`/connection/remove/${recipientId}`, { method: "DELETE" })
      setUnfollowed(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsRemoving(false)
    }
  }
  return (
    <button onClick={handleRemoval} className="p-2 ml-2">
      {isRemoving && !unfollowed 
        ? "Removing..."
        : unfollowed
        ? "Removed"
        : 'X'
      }
    </button>
  )
}