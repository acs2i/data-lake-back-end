import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser";
import mongoose, { Mongoose } from "mongoose";
import authorizationMiddlewear from "./middlewears/applicationMiddlewear";
// import applicationAuthentification from "./routes/applicationAuthentification"
// import userAuthenticationRoutes from "./routes/userAuthentification"

// import referenceRoutes from "./routes/referenceRoutes"
// import uvcRoutes from "./routes/uvcRoutes"
// import supplierRoutes from "./routes/supplierRoutes"
// import priceRoutes from "./routes/priceRoutes"
// import familyRoutes from "./routes/familyRoutes"
// import subFamilyRoutes from "./routes/subFamilyRoutes"
// import brandRoutes from "./routes/brandRoutes"
// import collectionRoutes from "./routes/collectionRoutes"

import productGetRoutes from "./routes/product/productGet";
import productPostRoutes from "./routes/product/productPost";

import brandGetRoutes from "./routes/brand/brandGet";
import brandPostRoutes from "./routes/brand/brandPost";

import collectionGetRoutes from "./routes/collection/collectionGet";
import collectionPostRoutes from "./routes/collection/collectionPost";




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
// app.use(v1, authorizationMiddlewear, priceRoutes)
// app.use(v1, authorizationMiddlewear, referenceRoutes)
// app.use(v1, authorizationMiddlewear, uvcRoutes)
// app.use(v1, authorizationMiddlewear, supplierRoutes)
// app.use(v1, authorizationMiddlewear, familyRoutes)
// app.use(v1, authorizationMiddlewear, subFamilyRoutes)
// app.use(v1, authorizationMiddlewear, brandRoutes)
// app.use(v1, authorizationMiddlewear, collectionRoutes)

app.use(v1, authorizationMiddlewear, productGetRoutes);
app.use(v1, authorizationMiddlewear, productPostRoutes);

app.use(v1, authorizationMiddlewear, brandGetRoutes);
app.use(v1, authorizationMiddlewear, brandPostRoutes);

app.use(v1, authorizationMiddlewear, collectionGetRoutes);
app.use(v1, authorizationMiddlewear, collectionPostRoutes);


app.listen(port, () => {
  
  mongoose.connect(URI).then((res: Mongoose) => console.log("Database connection has opened!"));
  
  console.log(`[server]: Server is running at http://localhost:${port}`);
});