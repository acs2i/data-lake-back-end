import express from "express";
import dotenv from "dotenv"
import authentificationRoutes from "./routes/authentification"
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use("/api", authentificationRoutes)


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});