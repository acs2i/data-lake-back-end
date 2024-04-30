import express, { Request, Response } from "express"
import { DIMENSION } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import DimensionModel from "../../schemas/dimensionSchema";
import { OK } from "../../codes/success";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();

router.delete(DIMENSION + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {

    try {

        const id = req.params.id;

        if(!id) {
            throw new Error(req.originalUrl + ", msg: id was falsy: " + id);
        }

        const response = await DimensionModel.deleteOne({ _id: id })

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