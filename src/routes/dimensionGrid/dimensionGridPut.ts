import express , {Request, Response} from "express"
import { DIMENSION_GRID } from "./shared"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear"
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import DimensionGrid from "../../schemas/dimensionGridSchema"
import { OK } from "../../codes/success"
import { UpdateWriteOpResult } from "mongoose"

const router = express.Router()

router.put(DIMENSION_GRID + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const object = req.body;

        if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }


        const _id = req.params.id;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: id was falsy: " + _id);
        }

        const response: UpdateWriteOpResult = await DimensionGrid.updateOne({ _id }, { $set: object })
 
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