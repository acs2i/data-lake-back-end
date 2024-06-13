import express , {Request, Response} from "express"
import { CLASS } from "./shared"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear"
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import ClassModel from "../../schemas/classSchema"
import { OK } from "../../codes/success"

const router = express.Router()
router.delete(CLASS + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id = req.params.id;

        if(!id) {
            throw new Error(req.originalUrl + ", msg: id was falsy: " + id);
        }

        const response = await ClassModel.deleteOne({ _id: id })

        if(response.deletedCount === 0) {
            res.status(INTERNAL_SERVER_ERROR).json({ msg: "class not found"});
        } else {
            res.status(OK).json(response);
        }

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

export default router;