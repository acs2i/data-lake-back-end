import express, { Request, Response } from "express"
import ProductModel from "../../schemas/productSchema";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";

const router = express.Router();


router.post(PRODUCT, async (req: Request, res: Response) => {
    try {
        // expects product 
        const product = req.body.product;

        if(!product) {
            throw new Error(req.originalUrl + ", msg: product was falsy: " + product)
        }

        const newProduct: Document | null | undefined = await new ProductModel({...product, GA_VERSION: 1});

        if(!newProduct) {
            throw new Error(req.originalUrl + " msg: product save did not work for some reason: " + product);
        }

        const savedProduct: Document | null | undefined = await newProduct.save({timestamps: true});
        
        const _id = savedProduct._id;

        const result = { ...product, _id}

        res.status(OK).json(result);
        
    }
    catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }



})

export default router;