import { useAuth } from "@/context/AuthContext"
import { NavLink } from "react-router"
import { PostsRes } from "shared-types"
import Follow from "./Follow"
import Like from "./Like";
import PostComment from "./Comment";
import { Button } from "./ui/button";
import { apiFetch } from "@/api/fetch";
import { useState } from "react";

export default function Post({ post }: { post: PostsRes }) {
  const { user } = useAuth();
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ deleted, setDeleted ] = useState(false)
  const handleDelete = async () => {
    if(isSubmitting) return;
    setIsSubmitting(true);
    try {
      await apiFetch(`/posts/${post.id}`, { method: "DELETE" })
      setDeleted(true)
    } catch (error) {
      console.error(error)
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
      <div>
        <NavLink to={`/dashboard/profile/${post.author.username}`}>
          {post.author.avatarUrl ? <img src={post.author.avatarUrl} /> : <div>{post.author.username[0]}</div>}
        </NavLink>
        <NavLink to={`/dashboard/profile/${post.author.username}`}>
          <p>Author: {post.author.username}</p>
        </NavLink>
        {user?.userId !== post.authorId && <Follow recipientId={post.authorId}/>}
        {user?.userId === post.authorId && <Button onClick={handleDelete}>{ isSubmitting ? "Deleting..." : "Delete" }</Button>} 
      </div>
      <h2>{post.content}</h2>
      <p>{new Date(post.createdAt).toLocaleString()}</p>
      <Like likeCount={post._count.likes} postId={post.id}/>
      <PostComment commentCount={post._count.comments} postId={post.id}/>
      {post.imgUrl && <img src={post.imgUrl} alt={post.content} />}
    </div>
  )
}