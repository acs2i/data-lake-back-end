import express, { Request, Response } from "express";
import { PRODUCT } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import { OK } from "../../codes/success";
import ProductModel, { Product } from "../../schemas/productSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();

router.put(PRODUCT + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const product = req.body;
        const uvc_ids = product.uvc_ids;

        if (!product) {
            throw new Error(req.originalUrl + ", msg: product was falsy: " + product);
        }

        const _id: string | undefined | null = req.params.id;

        if (!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id);
        }

        
        const oldProduct: Product | undefined | null = await ProductModel.findById(_id);

        if (!oldProduct) {
            throw new Error(req.originalUrl + ", msg: No product found with this id before the update");
        }

        let updatedProductData = { ...product };
        if (uvc_ids && uvc_ids.length > 0) {
            updatedProductData = {
                ...product,
                uvc_ids: uvc_ids,
            };
        }

     
        const response: UpdateWriteOpResult = await ProductModel.updateOne(
            { _id },
            { $set: updatedProductData }
        );

        if (response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json(updatedProductData); // Renvoie le produit mis à jour
        } else {
            throw new Error(
                req.originalUrl +
                    ", msg: There was a response that didn't match the needed criteria: " +
                    response.acknowledged +
                    " " +
                    response.matchedCount +
                    " " +
                    response.modifiedCount
            );
        }
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({});
    }
});

export default router;
