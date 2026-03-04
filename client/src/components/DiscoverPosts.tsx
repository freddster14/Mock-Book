import { PostsRes } from "shared-types";
import { apiFetch } from "../api/fetch";
import { useState } from "react";
import { useEffect } from "react";
import { ApiError } from "../types";
import Like from "./Like";
import PostComment from "./Comment";
import Follow from "./Follow";
import SearchNew from "./SearchNew";

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

function Post({ post }: { post: PostsRes }) {
  console.log(post)

  return (
    <div>
      <div>
        {post.author.avatarUrl ? <img src={post.author.avatarUrl} /> : <div>{post.author.username[0]}</div>}
        <p>Author: {post.author.username}</p>
        <Follow recipientId={post.authorId}/>
      </div>
      <h2>{post.content}</h2>
      <p>{new Date(post.createdAt).toLocaleString()}</p>
      <Like likeCount={post._count.likes} postId={post.id}/>
      <PostComment commentCount={post._count.comments} postId={post.id}/>
      {post.imgUrl && <img src={post.imgUrl} alt={post.content} />}
    </div>
  )
}