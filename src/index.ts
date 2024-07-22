import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser";
import mongoose, { Mongoose } from "mongoose";

import brandGetRoutes from "./routes/brand/brandGet";
import brandPostRoutes from "./routes/brand/brandPost";
import brandPutRoutes from "./routes/brand/brandPut";
import brandDeleteRoutes from "./routes/brand/brandDelete";

import collectionGetRoutes from "./routes/collection/collectionGet";
import collectionPostRoutes from "./routes/collection/collectionPost";
import collectionPutRoutes from "./routes/collection/collectionPut";
import collectionDeleteRoutes from "./routes/collection/collectionDelete";

import dimensionGetRoutes from "./routes/dimension/dimensionGet";
import dimensionPostRoutes from "./routes/dimension/dimensionPost";
import dimensionPutRoutes from "./routes/dimension/dimensionPut";
import dimensionDeleteRoutes from "./routes/dimension/dimensionDelete";

import dimensionGridGetRoutes from "./routes/dimensionGrid/dimensionGridGet";
import dimensionGridPostRoutes from "./routes/dimensionGrid/dimensionGridPost";
import dimensionGridPutRoutes from "./routes/dimensionGrid/dimensionGridPut";
import dimensionGridDeleteRoutes from "./routes/dimensionGrid/dimensionGridDelete";

import productGetRoutes from "./routes/product/productGet";
import productPostRoutes from "./routes/product/productPost";
import productPutRoutes from "./routes/product/productPut";
import productDeleteRoutes from "./routes/product/productDelete";

import supplierGetRoutes from "./routes/supplier/supplierGet"
import supplierPostRoutes from "./routes/supplier/supplierPost"
import supplierPutRoutes from "./routes/supplier/supplierPut"
import supplierDeleteRoutes from "./routes/supplier/supplierDelete"

import tagGetRoutes from "./routes/tag/tagGet";
import tagPostRoutes from "./routes/tag/tagPost";
import tagPutRoutes from "./routes/tag/tagPut";
import tagDeleteRoutes from "./routes/tag/tagDelete";

import uvcGetRoutes from "./routes/uvc/uvcGet";
import uvcPostRoutes from "./routes/uvc/uvcPost";
import uvcPutRoutes from "./routes/uvc/uvcPut";



dotenv.config();

const URI = process.env.REMOTE_DEV_DB_URI as string
const v1 = "/api/v1";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(v1, brandGetRoutes);
app.use(v1, brandPostRoutes);
app.use(v1, brandPutRoutes);
app.use(v1, brandDeleteRoutes); 

app.use(v1, collectionGetRoutes);
app.use(v1, collectionPostRoutes);
app.use(v1, collectionPutRoutes);
app.use(v1, collectionDeleteRoutes);

app.use(v1, dimensionGetRoutes);
app.use(v1, dimensionPostRoutes);
app.use(v1, dimensionPutRoutes);
app.use(v1, dimensionDeleteRoutes);


app.use(v1, dimensionGridGetRoutes);
app.use(v1, dimensionGridPostRoutes);
app.use(v1, dimensionGridPutRoutes);
app.use(v1, dimensionGridDeleteRoutes);


app.use(v1, productGetRoutes);
app.use(v1, productPostRoutes);
app.use(v1, productPutRoutes);
app.use(v1, productDeleteRoutes);

app.use(v1, uvcGetRoutes);
app.use(v1, uvcPostRoutes);
app.use(v1, uvcPutRoutes);

app.use(v1, supplierGetRoutes)
app.use(v1, supplierPostRoutes)
app.use(v1, supplierPutRoutes)
app.use(v1, supplierDeleteRoutes)

app.use(v1, tagGetRoutes)
app.use(v1, tagPostRoutes)
app.use(v1, tagPutRoutes) 
app.use(v1, tagDeleteRoutes)


app.listen(port, () => {
  
  mongoose.connect(URI).then((res: Mongoose) => console.log("Database connection has opened!"));
  
  console.log(`[server]: Server is running at http://localhost:${port}`);
});