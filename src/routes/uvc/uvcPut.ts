import express, { Request, Response } from "express"
import { UVC } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import UvcModel from "../../schemas/uvcSchema";

const router = express.Router();

router.put(UVC + "/:id", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const uvc = req.body;

        if(!uvc) {
            throw new Error(req.originalUrl + ", msg: uvc was falsy: " + uvc)
        }

        const _id: string | undefined | null = req.params.id;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id)
        }

        const response: UpdateWriteOpResult = await UvcModel.updateOne({ _id}, {$set: uvc })

        if (response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({ _id, ...uvc})
        } else{
            throw new Error(req.originalUrl + ", msg: There was a response that didn't match the needed criteria: "+response.acknowledged+" " +response.matchedCount+" "+response.modifiedCount)
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

export default router;
