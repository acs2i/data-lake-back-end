import express , {Request, Response} from "express"
import { CLASSIFICATION } from "./shared"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear"
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import { UpdateWriteOpResult } from "mongoose"
import ClassificationModel from "../../schemas/classificationSchema"
import { OK } from "../../codes/success"

const router = express.Router()


router.put(CLASSIFICATION + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const classification = req.body;

        if(!classification) {
            throw new Error(req.originalUrl + ", msg: classification was falsy: " + classification)
        }

        const _id: string | undefined | null = req.params.id;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id)
        }

        const response: UpdateWriteOpResult = await ClassificationModel.updateOne({ _id}, {$set: classification})

        if (response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json(classification)
        } else{
            throw new Error(req.originalUrl + ", msg: There was a response that didn't match the needed criteria: "+response.acknowledged+" " +response.matchedCount+" "+response.modifiedCount)
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})



export default router