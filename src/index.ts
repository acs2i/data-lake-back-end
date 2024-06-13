import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser";
import mongoose, { Mongoose } from "mongoose";

import brandGetRoutes from "./routes/brand/brandGet";
import brandPostRoutes from "./routes/brand/brandPost";
import brandPutRoutes from "./routes/brand/brandPut";
import brandDeleteRoutes from "./routes/brand/brandDelete";

import classGetRoutes from "./routes/class/classGet";
import classPostRoutes from "./routes/class/classPost";
import classPutRoutes from "./routes/class/classPut";
import classDeleteRoutes from "./routes/class/classPut";


import classificationGetRoutes from "./routes/classification/classificationGet";
import classificationPostRoutes from "./routes/classification/classificationPost";
import classificationPutRoutes from "./routes/classification/classificationPut";
import classificationDeleteRoutes from "./routes/classification/classificationDelete";


import collectionGetRoutes from "./routes/collection/collectionGet";
import collectionPostRoutes from "./routes/collection/collectionPost";
import collectionPutRoutes from "./routes/collection/collectionPut";
import collectionDeleteRoutes from "./routes/collection/collectionDelete";

import dimensionGetRoutes from "./routes/dimension/dimensionGet";
import dimensionPostRoutes from "./routes/dimension/dimensionPost";
import dimensionPutRoutes from "./routes/dimension/dimensionPut";
import dimensionDeleteRoutes from "./routes/dimension/dimensionDelete";

import familyGetRoutes from "./routes/family/familyGet"
import familyPostRoutes from "./routes/family/familyPost"
import familyPutRoutes from "./routes/family/familyPut"

import gridGetRoutes from "./routes/grid/gridGet";
import gridPostRoutes from "./routes/grid/gridPost";

import productGetRoutes from "./routes/product/productGet";
import productPostRoutes from "./routes/product/productPost";
import productPutRoutes from "./routes/product/productPut";
import productDeleteRoutes from "./routes/product/productDelete";

import uvcGetRoutes from "./routes/uvc/uvcGet";
import uvcPostRoutes from "./routes/uvc/uvcPost";
import uvcPutRoutes from "./routes/uvc/uvcPut";

import supplierGetRoutes from "./routes/supplier/supplierGet"

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

app.use(v1, classGetRoutes)
app.use(v1, classPostRoutes)
app.use(v1, classPutRoutes) 
app.use(v1, classDeleteRoutes) 


app.use(v1, classificationGetRoutes)
app.use(v1, classificationPostRoutes)
app.use(v1, classificationPutRoutes)
app.use(v1, classificationDeleteRoutes)

app.use(v1, collectionGetRoutes);
app.use(v1, collectionPostRoutes);
app.use(v1, collectionPutRoutes);
app.use(v1, collectionDeleteRoutes);

app.use(v1, dimensionGetRoutes);
app.use(v1, dimensionPostRoutes);
app.use(v1, dimensionPutRoutes);
app.use(v1, dimensionDeleteRoutes);

app.use(v1, familyGetRoutes);
app.use(v1, familyPostRoutes);
app.use(v1, familyPutRoutes);

app.use(v1, gridGetRoutes);
app.use(v1, gridPostRoutes);

// app.use(v1, productGetRoutes);
// app.use(v1, productPostRoutes);
// app.use(v1, productPutRoutes);
// app.use(v1, productDeleteRoutes);

app.use(v1, uvcGetRoutes);
app.use(v1, uvcPostRoutes);
app.use(v1, uvcPutRoutes);

app.use(v1, supplierGetRoutes)


app.listen(port, () => {
  
  mongoose.connect(URI).then((res: Mongoose) => console.log("Database connection has opened!"));
  
  console.log(`[server]: Server is running at http://localhost:${port}`);
});