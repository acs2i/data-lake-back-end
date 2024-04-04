import express, { Request, Response } from "express";

import dotenv from "dotenv"
import cors from "cors"
import userAuthenticationRoutes from "./routes/userAuthentification"
import applicationAuthentification from "./routes/applicationAuthentification"
import bodyParser from "body-parser";
import { decryptToken } from "./middlewears/userMiddlewear";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userAuthenticationRoutes)
app.use("/api", applicationAuthentification)
app.use('/', decryptToken, (req: Request, res: Response) => {

  res.send("Got here");
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});