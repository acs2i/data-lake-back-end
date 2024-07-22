import express, { Request, Response } from "express"
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import { generalLimits } from "../../services/generalServices"
import TagGroupingModel, { TagGrouping } from "../../schemas/tagGroupingSchema"
import { OK } from "../../codes/success"
import { TAG_GROUPING } from "./shared"

const router = express.Router()

router.get(TAG_GROUPING, async(req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        const data: TagGrouping[] | null | undefined = await TagGroupingModel.find().skip(skip).limit(intLimit)

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await TagGroupingModel.countDocuments({});

        res.status(OK).json({ data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})


export default router