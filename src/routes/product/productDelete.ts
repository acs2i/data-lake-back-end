import express, { Request, Response } from "express"
import { PRODUCT } from "./shared";
import ProductModel, { Product } from "../../schemas/productSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import ProductHistoryModel, { ProductHistory } from "../../schemas/productHistorySchema";
import { UpdateWriteOpResult } from "mongoose";

const router = express.Router();

router.delete(PRODUCT + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {

    try {

        const _id = req.params.id;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id);
        }

        const oldProduct: Product | undefined | null = await ProductModel.findById(_id)

        const response = await ProductModel.deleteOne({ _id })

        if(response.deletedCount === 0) {
            res.status(INTERNAL_SERVER_ERROR).json({ msg: "Brand not found"});
        } else {

            // Create the version
            const newProductHistoryVersion: ProductHistory = new ProductHistoryModel({...oldProduct, parent_product_id: null } )

            const savedNewProductHistory: ProductHistory | null | undefined = await newProductHistoryVersion.save({timestamps: true})

            if(!savedNewProductHistory) {
                
                const recreatedProduct: Product = new ProductModel({...oldProduct});

                const savedRecreatedProduct: Product | null | undefined = await recreatedProduct.save({timestamps: true})

                if(!savedRecreatedProduct) {
                    throw new Error(req.originalUrl + " , msg: Product history was not able to be updated, and the product WAS NOT able to be recreated")
                } else {
                    throw new Error(req.originalUrl + " , msg: Product history was not able to be updated, the product was recreated")
                }

            }

            res.status(OK).json(response);
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})

export default router;