import React, { useState } from "react"
import { apiFetch } from "../api/fetch"
import {  PostComments } from "shared-types"
import { ApiError } from "../types"
import { useAuth } from "../context/AuthContext"

export default function PostComment({ commentCount, postId}: { commentCount: number, postId: number}) {
  const { user } = useAuth();
  const [ comments, setComments ] = useState<PostComments[]>([])
  const [ count, setCount ] = useState(commentCount);
  const [ error, setError ] = useState<null | string>(null)
  const [ showComments, setShowComments ] = useState(false);
  const [ content, setContent ] = useState("");
  const [ userComments, setUserComments ] = useState<PostComments[]>([])

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
    if (!user) return;
    const tempPrev = { userComments, content}
    setUserComments(prev => [
      ...prev,
      {
        id: prev.length,
        content,
        postId,
        authorId: user.userId,
        createdAt: new Date(),
        author: {
          id: user.userId,
          username: user.username,
          avatarUrl: null,
        },
      },
    ])
    setContent("")
    const options = {
      method: "POST",
      body: JSON.stringify({ content })
    }
    const res = await apiFetch(`/comments/${postId}`, options);
    if (res.success) {
      //setStatus('')
    } else {
      
    }
  }
  console.log(comments)
  return (
    <>
      <p><button onClick={loadComments}>CommentLogo</button> {count}</p>
      {showComments && 
        <div>
          {userComments.length > 0 && 
            userComments.map((c, i) => (
              <div key={i + "t"} >
                <div>ProfilePic</div>  {/* Add onClick show navigate to profile */}
                <div>
                  <div>
                    <p>{c.author.username}</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                  <p>{c.content}</p>
                </div>
              </div>
            ))
          }
          { !error && comments.length > 0
          ? comments?.map(c => (
              <div key={c.id}>
                <div>ProfilePic</div>  {/* Add onClick show navigate to profile */}
                <div>
                  <div>
                    <p>{c.author.username}</p>
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