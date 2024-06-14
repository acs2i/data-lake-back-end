import express, { Request, Response } from "express"
import { DIMENSION_TYPE } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import DimensionTypeModel from "../../schemas/dimensionTypeSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();

router.put(DIMENSION_TYPE + "/:id", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const object = req.body;

        if(!object) {
            throw new Error(req.originalUrl + ", msg: collection was falsy: " + object)
        }

        const _id: string | undefined | null = req.params.id;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id)
        }

        console.log("object: " , object)
        const response: UpdateWriteOpResult = await DimensionTypeModel.updateOne({ _id}, {$set: object})

        if (response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json(object)
        } else{
            throw new Error(req.originalUrl + ", msg: There was a response that didn't match the needed criteria: "+response.acknowledged+" " +response.matchedCount+" "+response.modifiedCount)
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

export default router;
