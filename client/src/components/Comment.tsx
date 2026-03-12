import React, {  useRef, useState } from "react"
import { apiFetch } from "../api/fetch"
import {  Comment, PostComments, PostsRes, User, UserRes } from "shared-types"
import { ApiError } from "../types"
import { useAuth } from "../context/AuthContext"
import { NavLink } from "react-router"
import { Button } from "./ui/button"
import { Virtuoso, VirtuosoHandle } from "react-virtuoso"
import TimeAgo from "timeago-react"
import { Separator } from "./ui/separator"

export default function PostComment({ commentCount, postId, authorId }: { commentCount: number, postId: number, authorId: number}) {
  const { user } = useAuth();
  const [ comments, setComments ] = useState<PostComments[]>([])
  const [ count, setCount ] = useState(commentCount);
  const [ error, setError ] = useState<null | string>(null)
  const [ showComments, setShowComments ] = useState(false);
  const [ content, setContent ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ userComments, setUserComments ] = useState<{id: number, content: string}[] | []>([])
  const [ isFetchingMore, setIsFetchMore ] = useState(false)
  const allLoaded = useRef(false)
  const virtuso = useRef<VirtuosoHandle>(null)

  const loadComments = () => {
    const fetchComments = async () => {
      const res = await apiFetch(`/comments/${postId}`);
      if (res.success) {
        setComments(res.data)
        if (!res.data || res.data.length < 5) allLoaded.current = true;
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
      virtuso.current?.scrollToIndex({
        index: 0,
        align: 'start',
        behavior: 'smooth'
      })
      setComments(prev => [res.data, ...prev])
      setCount( prev => prev + 1)
    } catch (error) {
    } finally {
      setIsSubmitting(false);
      setUserComments(temp)
    }
  }


  const loadMore = async () => {
    if (isFetchingMore || allLoaded.current) return;
    setIsFetchMore(true);
    const cursor = comments[comments.length - 1].id
    try {
      const res = await apiFetch(`/comments/${postId}/?cursor=${cursor}`)
      if (res.data && res.data.length > 0) {
        setComments(prev => [...prev, ...res.data])
      } else {
        allLoaded.current = true;
      }
    } catch (error) {
      setError("Something went wrong, try again");
      allLoaded.current = true
    } finally {
      setIsFetchMore(false)
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
            ? 
              <Virtuoso
              style={{ height: "50vh", width: "100%" }}
              data={comments}
              endReached={loadMore}
              atBottomThreshold={300}
              ref={virtuso}
              itemContent={(_i, c) => (
                <div>
                  <CommentUI c={c} handleDelete={handleDelete} authorId={authorId} />
                  <Separator className="mt-4 mb-4" />
                </div>
              )}
              components={{
                Footer: () => (
                  <div
                    style={{
                      padding: "1rem",
                      paddingBottom: "2rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    { isFetchingMore && !allLoaded.current ? "Loading..." : "No more comments."}
                  </div>
                )
              }}
              />
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

export function CommentUI({c, handleDelete, authorId}:
  {
    c: Comment & { author: UserRes},
    handleDelete: Function,
    authorId: number
  }
) {
  const { user } = useAuth();

  

  return (
    <>
      <NavLink to={`/dashboard/profile/${c.author.username}`}>
      {c.author.avatarUrl ? <img src={c.author.avatarUrl} /> : <div>{c.author.username[0]}</div>}
      </NavLink>
      {(authorId === user?.userId || c.authorId === user?.userId)  && <Button onClick={() => handleDelete(c.id)}>Delete</Button> }
      <div>
        <div>
          <NavLink to={`/dashboard/profile/${c.author.username}`}>
            <p>Author: {c.author.username}</p>
          </NavLink>                    
          <TimeAgo  datetime={new Date(c.createdAt).toLocaleString()}/>
        </div>
        <p>{c.content}</p>
      </div>
    </>
    
  )
}