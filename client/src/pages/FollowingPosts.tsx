import { PostsRes } from "shared-types";
import { apiFetch } from "../api/fetch";
import { useState } from "react";
import { useEffect } from "react";
import { ApiError } from "../types";
import { Link } from "react-router";

import Post from "@/components/Post";

export default function FollowingPosts() {
  const [ posts, setPosts ] = useState<PostsRes[]>([]);
  const [ error, setError ] = useState<ApiError | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await apiFetch(`/posts`);
      if(res.success) {
        setPosts(res.data);
      } else if(res.error instanceof ApiError) {
        setError(res.error);
      } else {
        setError(new ApiError("Something went wrong, try again", "server", []));
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {error && <div>{error.msg}</div>}
      {posts.length > 0 
      ? posts.map(post => ( <Post key={post.id} post={post} />))
      : <p>Follow users to view their posts here. <Link to="/dashboard/discover">View other users posts.</Link></p>
      }
    </div>
  )
}