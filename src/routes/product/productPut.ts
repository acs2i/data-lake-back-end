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
        const uvc_ids = product.uvc_ids; // Assurer que uvc_ids est bien dans req.body

        console.log("Request body:", req.body); // Ajoute ce log pour vérifier le contenu de la requête

        if (!product) {
            throw new Error(req.originalUrl + ", msg: product was falsy: " + product);
        }

        const _id: string | undefined | null = req.params.id;

        if (!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id);
        }

        // Récupérer l'ancien produit pour une éventuelle gestion des versions ou pour vérifier les données existantes
        const oldProduct: Product | undefined | null = await ProductModel.findById(_id);

        if (!oldProduct) {
            throw new Error(req.originalUrl + ", msg: No product found with this id before the update");
        }

        // Si des UVC sont envoyés, les ajouter ou les remplacer dans le produit
        let updatedProductData = { ...product };
        if (uvc_ids && uvc_ids.length > 0) {
            updatedProductData = {
                ...product,
                uvc_ids: uvc_ids, // Mettre à jour ou ajouter les UVC associés
            };
        }

        // Mise à jour du produit avec les nouvelles données
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
