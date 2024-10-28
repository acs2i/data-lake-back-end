import express, { Request, Response } from "express"
import BrandModel from "../../schemas/brandSchema";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { BRAND } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();

router.post(BRAND, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const object = req.body;

        if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }

        // Vérifier si le code existe déjà
        const existingBrand = await BrandModel.findOne({ code: req.body.code });
        
        if (existingBrand) {
            return res.status(409).json({  // 409 Conflict
                message: "Une marque avec ce code existe déjà",
                error: "DUPLICATE_CODE"
            });
        }

        const newObject: Document | null | undefined = await new BrandModel({...object});

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: brand save did not work for some reason: " + object);
        }

        const savedObject: Document | null | undefined = await newObject.save({timestamps: true});
        
        res.status(OK).json(savedObject);
    }
    catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
});

export default router;