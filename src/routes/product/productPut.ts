import express, { Request, Response } from "express"
import { PRODUCT } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import { OK } from "../../codes/success";
import ProductModel, { Product } from "../../schemas/productSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import ProductHistoryModel, { ProductHistory } from "../../schemas/productHistorySchema";

const router = express.Router();

router.put(PRODUCT + "/:id", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const product = req.body;

        if(!product) {
            throw new Error(req.originalUrl + ", msg: product was falsy: " + product)
        }

        const _id: string | undefined | null = req.params.id;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id)
        }

        // Before the product is updated, get the old version
        const oldProduct: Product | undefined | null = await ProductModel.findById(_id)

        if(!oldProduct) {
            throw new Error(req.originalUrl + ", msg: For some reason, a product was not found with this id before the update was made")
        }

        const response: UpdateWriteOpResult= await ProductModel.updateOne({ _id}, {$set: product })


        if (response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {

            // If the product was updated, then add it to the version
            const newProductHistory: ProductHistory | null | undefined = new ProductHistoryModel({...product, parent_product_id: _id})

            const savedNewProductHistory: ProductHistory | null | undefined = await newProductHistory.save({timestamps: true})

            if(!savedNewProductHistory) {
                // Attempt to roll back save
                const responseToRollback: UpdateWriteOpResult = await ProductModel.updateOne({_id}, {$set: oldProduct})

                if(responseToRollback.acknowledged === true && responseToRollback.matchedCount === 1 && responseToRollback.modifiedCount === 1) {
                    throw new Error(req.originalUrl + ", msg: Product History was not able to be saved. Change were rolled back")
                } else {
                    throw new Error(req.originalUrl + ", msg: Product History was not able to be saved. Changes WERE NOT able to to be rolled back")
                }

            }

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