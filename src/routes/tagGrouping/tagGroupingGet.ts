import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";
import { TAG_GROUPING } from "./shared";
import { OK } from "../../codes/success";
import TagGroupingModel, { TagGrouping } from "../../schemas/tagGroupingSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";

const router = express.Router();

router.get(TAG_GROUPING + "/search" , authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const {intLimit, skip} = await generalLimits(req);

        const {type, level} = req.query;

        const filter = {}

        if(type) {
            const regexType = new RegExp(type as string, "i")
            
        }

        const data: TagGrouping[] | null | undefined = await TagGroupingModel.find().skip(skip).limit(intLimit)


        if(!type && ( !level || level.length === 0)) {
            throw new Error(req.originalUrl + ", msg: Both level and type were falsy")
        }


        const total = await TagGroupingModel.countDocuments(filter)

        res.status(OK).json({data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})

router.get(TAG_GROUPING, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        const data: TagGrouping[] | null | undefined = await TagGroupingModel.find().skip(skip).limit(intLimit)

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }
        const total = await TagGroupingModel.countDocuments();

        res.status(OK).json({ data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;