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
        // expects brand 
        const object = req.body;

        if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }

        const {code} = object;
        
        const doesExist : Document | null | undefined = await BrandModel.findOne({ code });
        
        if(doesExist) throw new Error("Une collection avec le code suivant existe déjà: " + code);

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


})

export default router;