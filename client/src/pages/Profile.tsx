import { useLoaderData } from "react-router";
import { ProfileRes } from "shared-types";
import Follow from "../components/Follow";

export default function Profile() {
  const res = useLoaderData();
  const user: ProfileRes = res.data;

  return (
    <>
      <div>
        {user.avatarUrl ? <img src={user.avatarUrl} /> : <div>{user.username[0]}</div>}
        <p>{user.username}</p>
        <div>
          <p>Posts {user.posts.length}</p>
          <p>Followers {user._count.followers}</p>
          <p>Following {user._count.following}</p>
        </div>
        <Follow recipientId={user.id}/>
      </div>
      <p>{user.bio}</p>
      <div>
        {user.posts.length > 0
          ? user.posts.map(p => (
            <div key={p.id}>
              <p>{p.content}</p>
            </div>
          ))
          : <p>No Posts</p>
        }
      </div>
    </>
  )
}