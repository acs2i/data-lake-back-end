import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser";
import mongoose, { Mongoose } from "mongoose";

import authorizationMiddlewear from "./middlewears/applicationMiddlewear";

import productGetRoutes from "./routes/product/productGet";
import productPostRoutes from "./routes/product/productPost";
import productDeleteRoutes from "./routes/product/productDelete";

import brandGetRoutes from "./routes/brand/brandGet";
import brandPostRoutes from "./routes/brand/brandPost";
import brandDeleteRoutes from "./routes/brand/brandDelete";


import collectionGetRoutes from "./routes/collection/collectionGet";
import collectionPostRoutes from "./routes/collection/collectionPost";
import collectionDeleteRoutes from "./routes/collection/collectionDelete";

import familyGetRoutes from "./routes/family/familyGet"
import familyPostRoutes from "./routes/family/familyPost"
                   
dotenv.config();

const URI = process.env.REMOTE_DEV_DB_URI as string
const v1 = "/api/v1";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(v1, authorizationMiddlewear, productGetRoutes);
app.use(v1, authorizationMiddlewear, productPostRoutes);
app.use(v1, authorizationMiddlewear, productDeleteRoutes);


app.use(v1, authorizationMiddlewear, brandGetRoutes);
app.use(v1, authorizationMiddlewear, brandPostRoutes);
app.use(v1, authorizationMiddlewear, brandDeleteRoutes);

app.use(v1, authorizationMiddlewear, collectionGetRoutes);
app.use(v1, authorizationMiddlewear, collectionPostRoutes);
app.use(v1, authorizationMiddlewear, collectionDeleteRoutes);

app.use(v1, authorizationMiddlewear, familyGetRoutes);
app.use(v1, authorizationMiddlewear, familyPostRoutes);



app.listen(port, () => {
  
  mongoose.connect(URI).then((res: Mongoose) => console.log("Database connection has opened!"));
  
  console.log(`[server]: Server is running at http://localhost:${port}`);
});