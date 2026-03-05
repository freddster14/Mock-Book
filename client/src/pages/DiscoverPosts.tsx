import { PostsRes } from "shared-types";
import { apiFetch } from "../api/fetch";
import { useState } from "react";
import { useEffect } from "react";
import { ApiError } from "../types";
import SearchNew from "../components/SearchNew";
import Post from "@/components/Post";

export default function DiscoverPosts() {
  const [ posts, setPosts ] = useState<PostsRes[]>([]);
  const [ error, setError ] = useState<ApiError | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await apiFetch(`/posts/discover`);
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

  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <SearchNew />
      {error && <div>{error.msg}</div>}
      {posts.map(post => ( <Post key={post.id} post={post} /> ))}
    </div>
  )
}
