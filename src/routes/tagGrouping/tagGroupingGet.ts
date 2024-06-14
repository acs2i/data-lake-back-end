import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";
import { TAG_GROUPING } from "./shared";
import { OK } from "../../codes/success";
import TagGroupingModel from "../../schemas/tagGroupingSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { Document } from "mongoose";

const router = express.Router();

router.get(TAG_GROUPING, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        const documents: Document[] | null | undefined = await TagGroupingModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }
        const total = await TagGroupingModel.countDocuments({});

        res.status(OK).json({ data: [...documents], total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;