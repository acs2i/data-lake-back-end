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
        const brand = req.body;

        if(!brand) {
            throw new Error(req.originalUrl + ", msg: brand was falsy: " + brand)
        }

        console.log(brand)

        const newBrand: Document | null | undefined = await new BrandModel({...brand});

        if(!newBrand) {
            throw new Error(req.originalUrl + " msg: brand save did not work for some reason: " + brand);
        }

        const savedBrand: Document | null | undefined = await newBrand.save({timestamps: true});
        
        res.status(OK).json(savedBrand);
        
    }
    catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }


})

export default router;