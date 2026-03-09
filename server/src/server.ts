import "./types/userToken"
import express  from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import { index } from "./routes";
import { post } from "./routes/post";
import { connections } from "./routes/connection";
import { comments } from "./routes/comment";
import { likes } from "./routes/like";
import { user } from "./routes/user";

const app = express();
const PORT = 3000;

app.use(cors( {
  origin: ["http://localhost:5173", "https://mock-book.vercel.app/"],
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())

app.use('/', index);
app.use('/posts', post);
app.use('/connections', connections);
app.use('/comments', comments);
app.use('/likes', likes);
app.use('/users', user)

app.listen(PORT, () => console.log(`Live on port: ${PORT}`))