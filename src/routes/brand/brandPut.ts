import express, { Request, Response } from "express"
import { BRAND } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import BrandModel from "../../schemas/brandSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();

router.put(BRAND, authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const brand = req.body;

        if(!brand) {
            throw new Error(req.originalUrl + ", msg: brand was falsy: " + brand)
        }

        const {_id} = brand;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id)
        }

        console.log("BRAND: " , brand)

        const response: UpdateWriteOpResult = await BrandModel.updateOne({ _id}, {$set: brand })

        if (response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json(brand)
        } else{
            throw new Error(req.originalUrl + ", msg: There was a response that didn't match the needed criteria: "+response.acknowledged+" " +response.matchedCount+" "+response.modifiedCount)
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

export default router;
