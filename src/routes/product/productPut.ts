import express, { Request, Response } from "express"
import { PRODUCT } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import { OK } from "../../codes/success";
import ProductModel from "../../schemas/productSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";

const router = express.Router();

router.put(PRODUCT, async ( req: Request, res: Response) => {
    try {

        const product = req.body;

        if(!product) {
            throw new Error(req.originalUrl + ", msg: product was falsy: " + product)
        }

        const {_id} = product;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id)
        }

        const response: UpdateWriteOpResult= await ProductModel.updateOne({ _id}, {$set: product })

        console.log(response)

        if (response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json(product)
        } else{
            throw new Error(req.originalUrl + ", msg: There was a response that didn't match the needed criteria: "+response.acknowledged+" " +response.matchedCount+" "+response.modifiedCount)
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

export default router