import { useState } from "react";
import { apiFetch } from "@/api/fetch";
import { ApiError } from "@/types";
import { toast } from "sonner";

export default function RemoveFollowers({ recipientId }: { recipientId: number }) {
  const [ isRemoving, setIsRemoving ] = useState(false);
  const [ unfollowed, setUnfollowed ] = useState(false);

  const handleRemoval = async () => {
    setIsRemoving(true);
    try {
      await apiFetch(`/connection/remove/${recipientId}`, { method: "DELETE" })
      setUnfollowed(true)
    } catch (error) {
      if (error instanceof ApiError) {
        toast(error.msg)
      } else {
        toast("Something went wrong, try again")
      }
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