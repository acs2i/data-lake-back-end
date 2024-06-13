import express, { Request, Response } from "express"
import { CLASSIFICATION } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import ClassificationModel from "../../schemas/classificationSchema";

const router = express.Router();

router.delete(CLASSIFICATION + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {

    try {

        const id = req.params.id;

        if(!id) {
            throw new Error(req.originalUrl + ", msg: id was falsy: " + id);
        }

        const response = await ClassificationModel.deleteOne({ _id: id })

        if(response.deletedCount === 0) {
            res.status(INTERNAL_SERVER_ERROR).json({ msg: "collection not found"});
        } else {
            res.status(OK).json(response);
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})

export default router;