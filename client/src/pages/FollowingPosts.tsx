import { PostsRes } from "shared-types";
import { apiFetch } from "../api/fetch";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { ApiError } from "../types";
import { Link } from "react-router";

import Post from "@/components/Post";
import { Virtuoso } from "react-virtuoso";
import { Separator } from "@/components/ui/separator";

export default function FollowingPosts() {
  const [ posts, setPosts ] = useState<PostsRes[]>([]);
  const [ error, setError ] = useState<ApiError | null>(null);
  const [ loading, setLoading ] = useState(true);
  const [skip, setSkip] = useState(5);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const allLoaded = useRef(false);


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

  const loadMore = async () => {
    // Prevent multiple triggers and loading if all posts are fetched
    if (isFetchingMore || allLoaded.current) return;
    setIsFetchingMore(true);
    try {
      const res = await apiFetch(`/posts/?skip=${skip}`);
      if (res.data && res.data.length > 0) {
        setPosts((prev) => [...prev, ...res.data]);
        setSkip((prev) => prev + 5);
        if (res.data.length < 5) {
          // No more posts available
          allLoaded.current = true;
        }
      } else {
        allLoaded.current = true;
      }
    } catch (error) {
      setError(new ApiError("Something went wrong, try again", "server", []));
      allLoaded.current = true;
    } finally {
      setIsFetchingMore(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="pt-6 pb-6">
      {error && <div>{error.msg}</div>}
      {posts.length > 0 
      ?  <Virtuoso
      style={{ height: "100%", width: "100%" }}
      data={posts}
      endReached={loadMore}
      useWindowScroll
      atBottomThreshold={300}
      itemContent={(_i, p) => (
        <div>
          <Post post={p} />
          <Separator className="mt-4 mb-4" />
        </div>
      )}
      components={{
        Footer: () =>
          (
            <div
              style={{
                padding: "1rem",
                paddingBottom: "100px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              { isFetchingMore && !allLoaded.current ? "Loading..." : "No more posts."}
            </div>
          )
      }}
    />
      : <p>Follow users to view their posts here. <Link to="/dashboard/discover">View other users posts.</Link></p>
      }
    </div>
  )}
