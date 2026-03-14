import { useAuth } from "@/context/AuthContext"
import { NavLink } from "react-router"
import { PostsRes } from "shared-types"
import Follow from "./Follow"
import Like from "./Like";
import PostComment from "./Comment";
import { Button } from "./ui/button";
import { apiFetch } from "@/api/fetch";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import TimeAgo from "timeago-react";
import { toast } from "sonner";
import { ApiError } from "@/types";

export default function Post({ post }: { post: PostsRes }) {
  const { user } = useAuth();
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ deleted, setDeleted ] = useState(false);

  const handleDelete = async () => {
    if(isSubmitting) return;
    setIsSubmitting(true);
    try {
      await apiFetch(`/posts/${post.id}`, { method: "DELETE" })
      setDeleted(true)
    } catch (error) {
      if (error instanceof ApiError) {
        toast(error.msg)
      } else {
        toast("Something went wrong, try again")
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  if (deleted) {
    return (
      <div>Deleted</div>
    )
  }

  return (
    <div>
      <div className="flex gap-3 p-2 h-fit items-center">
        <NavLink to={`/dashboard/profile/${post.author.username}`}>
          <Avatar size="lg">
          {post.author.avatarUrl
            ? <AvatarImage src={post.author.avatarUrl} />
            : <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          }
          </Avatar>
        </NavLink>
        <NavLink to={`/dashboard/profile/${post.author.username}`}>
          <p className="text-lg">{post.author.username}</p>
          <TimeAgo  datetime={new Date(post.createdAt).toLocaleString()}/>
        </NavLink>
        <div className="ml-auto">
          {user?.userId !== post.authorId && <Follow recipientId={post.authorId}/>}
          {user?.userId === post.authorId && <Button onClick={handleDelete}>{ isSubmitting ? "Deleting..." : "Delete" }</Button>} 
        </div>
      </div>
      <Separator />
      <div className="pt-2 pb-2">
        <p>{post.content}</p>
        {post.imgUrl && <img src={post.imgUrl} alt={post.content} />}
      </div>
      <Separator />
      <div className="flex gap-3">
        <Like likeCount={post._count.likes} postId={post.id}/>
        <PostComment commentCount={post._count.comments} postId={post.id} authorId={post.authorId}/>
      </div>
    </div>
  )
}