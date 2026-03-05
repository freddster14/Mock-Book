import React, { useState } from "react"
import { apiFetch } from "../api/fetch"
import {  PostComments } from "shared-types"
import { ApiError } from "../types"
import { useAuth } from "../context/AuthContext"
import { NavLink } from "react-router"
import { Button } from "./ui/button"

export default function PostComment({ commentCount, postId, authorId }: { commentCount: number, postId: number, authorId: number}) {
  const { user } = useAuth();
  const [ comments, setComments ] = useState<PostComments[]>([])
  const [ count, setCount ] = useState(commentCount);
  const [ error, setError ] = useState<null | string>(null)
  const [ showComments, setShowComments ] = useState(false);
  const [ content, setContent ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ userComments, setUserComments ] = useState<{id: number, content: string}[] | []>([])

  const loadComments = () => {
    const fetchComments = async () => {
      const res = await apiFetch(`/comments/${postId}`);
      if (res.success) {
        setComments(res.data)
      } else if(res.error instanceof ApiError) {
        setError(res.error.msg);
      }
      setShowComments(true)
    }
    fetchComments();
  } 

  const handleComment = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;
    setIsSubmitting(true)
    const temp = userComments;
    setUserComments(prev => [
      ...prev,
      {
        id: prev.length,
        content,

      },
    ])
    setContent("")
    const options = {
      method: "POST",
      body: JSON.stringify({ content })
    }
    try {
      const res = await apiFetch(`/comments/${postId}`, options);
      setComments(prev => [...prev, res.data])
      setCount( prev => prev + 1)
    } catch (error) {
    } finally {
      setIsSubmitting(false);
      setUserComments(temp)
    }
  }
  // make comment independent component to keep track of deletion and status?

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/comments/${id}`, { method: "DELETE" })
      const newComments = comments.filter(c => c.id !== id)
      setCount(prev => prev - 1)
      setComments(newComments)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <p><button onClick={loadComments}>CommentLogo</button> {count}</p>
      {showComments && 
        <div>
          <div>
            {userComments.length > 0 && 
              userComments.map((c, i) => (
                <div key={i + "t"} >
                  <div>
                    {user?.avatarUrl ? <img src={user?.avatarUrl} /> : <div>{user?.username[0]}</div>}
                  </div>
                  <div>
                    <div>
                      <p>{user?.username}</p>
                      <p>Posting...</p>
                    </div>
                    <p>{c.content}</p>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="flex flex-col-reverse">
            { !error && comments.length > 0
            ? comments?.map(c => (
                <div key={c.id} >
                  <NavLink to={`/dashboard/profile/${c.author.username}`}>
                    {c.author.avatarUrl ? <img src={c.author.avatarUrl} /> : <div>{c.author.username[0]}</div>}
                  </NavLink>
                  { (authorId === user?.userId || c.authorId === user?.userId)  && <Button onClick={() => handleDelete(c.id)}>Delete</Button> }
                  <div>
                    <div>
                      <NavLink to={`/dashboard/profile/${c.author.username}`}>
                        <p>Author: {c.author.username}</p>
                      </NavLink>                    
                      <p>{new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                    <p>{c.content}</p>
                  </div>
                </div>
              ))
              : !error 
              ? <p>No comments yet</p> 
              : <p>{error}</p>
            }
          </div>
          <form onSubmit={handleComment}>
            <label htmlFor="content">
              <input type="text" id="content" placeholder="Comment something..." value={content} onChange={(e) => setContent(e.target.value)} />
              <button type="submit">Comment</button>
            </label>
          </form>
        </div>
      }
      
    </>
  )
}