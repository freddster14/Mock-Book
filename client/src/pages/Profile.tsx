import { Link, NavLink, useLoaderData, useNavigate, useParams, useSearchParams } from "react-router";
import { ProfileRes } from "shared-types";
import Follow from "../components/Follow";
import { useAuth } from "@/context/AuthContext";
import { Virtuoso } from "react-virtuoso";
import Post from "@/components/Post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { user } = useAuth();
  const res = useLoaderData();
  const currUser: ProfileRes = res.data;
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex gap-4">
        <Avatar className="w-[20vw] h-[20vw] max-w-38 max-h-38 aspect-square">
          {currUser.avatarUrl
            ? <AvatarImage src={currUser.avatarUrl} />
            : (
                <AvatarFallback className="w-full h-full aspect-square flex items-center justify-center text-2xl md:text-4xl">
                  {currUser.username[0]}
                </AvatarFallback>
              )
          }
        </Avatar>
        <div className="flex flex-col gap-5">
          <p className="text-xl pl-1 pt-1">{currUser.username}</p>
          <div className="flex gap-3">
            <p>Posts {currUser.posts.length}</p>
            <Link to={`/dashboard/connections/${currUser.username}/followers`}>Followers {currUser._count.followers}</Link>
            <Link to={`/dashboard/connections/${currUser.username}/following`}>Following {currUser._count.following}</Link>
          </div>
          { user?.userId === currUser.id && <NavLink to={`/dashboard/profile/edit/${user.username}`}><Button className="w-full">Edit</Button></NavLink>}
          {user?.userId !== currUser.id && <Follow recipientId={currUser.id} />}
        </div>
      </div>
      <p>{currUser.bio}</p>
      <div>
        {currUser.posts.length > 0 ? 
          currUser.posts.map((p, i) => (
            <div key={p.id} onClick={() => navigate(`posts/${currUser.id}/?index=${i}`)} style={{ cursor: "pointer" }}>
              <p>{p.content}</p>
            </div>
          ))
          : user?.userId === currUser.id
          ? <p>Create your first post. <Link to={`/dashboard/create-post`}><Button>Create</Button></Link></p>
          : <p>No Posts Yet</p>
        }
      </div>
    </div>
  );
}

export function UserPosts() {
  const [searchParams] = useSearchParams();
  const { user } = useParams();
  const res = useLoaderData()
  const initialIndex = parseInt(searchParams.get("index") || "0");
  const posts = res.data;

  return (
    <div>
      <Link to={`/dashboard/profile/${user}`}><Button variant="link">{`<- ${user}`}</Button></Link>
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
    </div>
   
  );
}