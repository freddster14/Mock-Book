import express  from "express";
import cors from "cors"
import { index } from "./routes";

const app = express();
const PORT = 3000;

app.use(cors( {
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(express.json())
app.use('/', index);


app.listen(PORT, () => console.log(`Live on port: ${PORT}`))