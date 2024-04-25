import express, { Request, Response } from "express"
import { FAMILY } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import FamilyModel from "../../schemas/familySchema";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();

router.put(FAMILY, authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const family = req.body;

        if(!family) {
            throw new Error(req.originalUrl + ", msg: family was falsy: " + family)
        }

        const {_id} = family;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id)
        }

        const response: UpdateWriteOpResult = await FamilyModel.updateOne({ _id}, {$set: family })

        console.log(response)

        if (response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json(family)
        } else{
            throw new Error(req.originalUrl + ", msg: There was a response that didn't match the needed criteria: "+response.acknowledged+" " +response.matchedCount+" "+response.modifiedCount)
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

export default router;
