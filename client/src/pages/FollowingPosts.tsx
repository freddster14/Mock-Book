import { PostsRes } from "shared-types";
import { apiFetch } from "../api/fetch";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { ApiError } from "../types";
import { Link } from "react-router";

import Post from "@/components/Post";
import { Virtuoso } from "react-virtuoso";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function FollowingPosts() {
  const [ posts, setPosts ] = useState<PostsRes[]>([]);
  const [ error, setError ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const allLoaded = useRef(false);


  useEffect(() => {
    const fetchPosts = async () => {
      setError(false)
      try {
        const res = await apiFetch(`/posts`);
        setPosts(res.data);
      } catch (error) {
        setError(true)
        if (error instanceof ApiError) {
          toast(error.msg)
        } else {
          toast("Something went wrong, try again")
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const loadMore = async () => {
    setError(false)
    // Prevent multiple triggers and loading if all posts are fetched
    if (isFetchingMore || allLoaded.current) return;
    const cursor = posts[posts.length - 1].id;
    setIsFetchingMore(true);
    try {
      const res = await apiFetch(`/posts/?cursor=${cursor}`);
      if (res.data && res.data.length > 0) {
        setPosts((prev) => [...prev, ...res.data]);
        if (res.data.length < 5) {
          // No more posts available
          allLoaded.current = true;
        }
      } else {
        allLoaded.current = true;
      }
    } catch (error) {
      setError(true)
      if (error instanceof ApiError) {
        toast(error.msg)
      } else {
        toast("Something went wrong, try again")
      }
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
      : error ? <p>Could not load posts</p> : <p>Follow users to view their posts here. <Link to="/dashboard/discover">View other users posts.</Link></p>
      }
    </div>
  )}
