import express, { Request, Response } from "express";

import dotenv from "dotenv"
import cors from "cors"

// import applicationAuthentification from "./routes/applicationAuthentification"
// import userAuthenticationRoutes from "./routes/userAuthentification"

import referenceRoutes from "./routes/referenceRoutes"
import uvcRoutes from "./routes/uvcRoutes"
import supplierRoutes from "./routes/supplierRoutes"

import bodyParser from "body-parser";
import { decryptToken } from "./middlewears/userMiddlewear";
import mongoose, { Mongoose } from "mongoose";
dotenv.config();

const URI = process.env.REMOTE_DEV_DB_URI as string


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/api/v1", userAuthenticationRoutes)  // uses token
// app.use("/api/v1", applicationAuthentification) // simple just hashes password and checks for it in db since no storage on server side
app.use("/api/v1", referenceRoutes)
app.use("/api/v1", uvcRoutes)
app.use("/api/v1", supplierRoutes)


app.use('/', decryptToken, (req: Request, res: Response) => {

  res.send("Got here");
})

app.listen(port, () => {
  
  mongoose.connect(URI).then((res: Mongoose) => console.log("Database connection has opened!"));
  
  console.log(`[server]: Server is running at http://localhost:${port}`);
});