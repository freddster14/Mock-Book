import { Link, useLoaderData, useNavigate, useParams, useSearchParams } from "react-router";
import { ProfileRes } from "shared-types";
import Follow from "../components/Follow";
import { useAuth } from "@/context/AuthContext";
import { Virtuoso } from "react-virtuoso";
import Post from "@/components/Post";

export default function Profile() {
  const { user } = useAuth();
  const res = useLoaderData();
  const currUser: ProfileRes = res.data;
  const navigate = useNavigate()

  return (
    <>
      <div>
        {currUser.avatarUrl ? (
          <img src={currUser.avatarUrl} alt={currUser.username} />
        ) : (
          <div>{currUser.username[0]}</div>
        )}
        <p>{currUser.username}</p>
        <div>
          <p>Posts {currUser.posts.length}</p>
          <p>Followers {currUser._count.followers}</p>
          <p>Following {currUser._count.following}</p>
        </div>
        {user?.userId !== currUser.id && <Follow recipientId={currUser.id} />}
      </div>
      <p>{currUser.bio}</p>
      <div>
        {currUser.posts.length > 0 ? (
          currUser.posts.map((p, i) => (
            <div key={p.id} onClick={() => navigate(`posts/${currUser.id}/?index=${i}`)} style={{ cursor: "pointer" }}>
              <p>{p.content}</p>
            </div>
          ))
        ) : (
          <p>No Posts</p>
        )}
      </div>
    </>
  );
}

export function UserPosts() {
  const [searchParams] = useSearchParams();
  const { user } = useParams();
  const res = useLoaderData()
  const initialIndex = parseInt(searchParams.get("index") || "0");
  const posts = res.data;

  return (
    <>
      <Link to={`/dashboard/profile/${user}`}>Back to Profile</Link>
     <Virtuoso
      style={{ height: "60dvh", width: "100%" }}
      totalCount={posts.length}
      initialTopMostItemIndex={initialIndex}
      itemContent={i => (
        <div style={{ borderBottom: "1px solid #eee", padding: 16 }}>
          <Post post={posts[i]} />
        </div>
      )}
    />
    </>
   
  );
}