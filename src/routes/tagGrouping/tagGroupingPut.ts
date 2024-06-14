import express , {Request, Response} from "express"
import { TAG_GROUPING } from "./shared"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear"
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import { UpdateWriteOpResult } from "mongoose"
import TagModel from "../../schemas/tagGroupingSchema"
import { OK } from "../../codes/success"

const router = express.Router()


router.put(TAG_GROUPING + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const object = req.body;

        if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }

        const _id: string | undefined | null = req.params.id;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id)
        }

        const response: UpdateWriteOpResult = await TagModel.updateOne({ _id}, {$set: object})

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



export default router