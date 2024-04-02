import express from "express";
import dotenv from "dotenv"
import userAuthenticationRoutes from "./routes/userAuthentification"
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userAuthenticationRoutes)


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});