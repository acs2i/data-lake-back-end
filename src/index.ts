import express from "express";

import dotenv from "dotenv"
import cors from "cors"

// import applicationAuthentification from "./routes/applicationAuthentification"
// import userAuthenticationRoutes from "./routes/userAuthentification"

import referenceRoutes from "./routes/referenceRoutes"
import uvcRoutes from "./routes/uvcRoutes"
import supplierRoutes from "./routes/supplierRoutes"
import priceRoutes from "./routes/priceRoutes"
import familyRoutes from "./routes/familyRoutes"
import subFamilyRoutes from "./routes/subFamilyRoutes"
import brandRoutes from "./routes/brandRoutes"


import bodyParser from "body-parser";
import mongoose, { Mongoose } from "mongoose";
dotenv.config();

const URI = process.env.REMOTE_DEV_DB_URI as string
const v1 = "/api/v1";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/api/v1", userAuthenticationRoutes)  // uses token
// app.use("/api/v1", applicationAuthentification) // simple just hashes password and checks for it in db since no storage on server side
app.use(v1, priceRoutes)
app.use(v1, referenceRoutes)
app.use(v1, uvcRoutes)
app.use(v1, supplierRoutes)
app.use(v1, familyRoutes)
app.use(v1, subFamilyRoutes)
app.use(v1, brandRoutes)

app.listen(port, () => {
  
  mongoose.connect(URI).then((res: Mongoose) => console.log("Database connection has opened!"));
  
  console.log(`[server]: Server is running at http://localhost:${port}`);
});