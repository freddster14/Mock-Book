import express  from "express";
import cors from "cors"

const app = express();
const PORT = 3000;

app.use(cors())

app.get('/', (req, res) => console.log("Live"));

app.listen(PORT, () => console.log(`Live on port: ${PORT}`))