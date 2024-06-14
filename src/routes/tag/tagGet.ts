import express, { Request, Response } from "express"
import { TAG } from "./shared"
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import { generalLimits } from "../../services/generalServices"
import TagModel from "../../schemas/tagSchema"
import { Document } from "mongoose"
import { OK } from "../../codes/success"

const router = express.Router()

router.get(TAG, async(req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        const documents: Document[] | null | undefined = await TagModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await TagModel.countDocuments({});

        res.status(OK).json({ data: [...documents], total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})


export default router