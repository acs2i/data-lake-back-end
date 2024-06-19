import express , {Request, Response} from "express"
import { TAG } from "./shared"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear"
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import TagModel from "../../schemas/tagSchema"
import { OK } from "../../codes/success"
import { UpdateWriteOpResult } from "mongoose"

const router = express.Router()

router.put(TAG + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const tag = req.body;

        if(!tag) {
            throw new Error(req.originalUrl + ", msg: tag was falsy: " + tag)
        }


        const _id = req.params.id;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: id was falsy: " + _id);
        }

        const response: UpdateWriteOpResult = await TagModel.updateOne({ _id }, { $set:tag })
 
        if(response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json(response);
        } else {
            res.status(INTERNAL_SERVER_ERROR).json({ msg: "tag was not updated"});
        }

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

export default router;