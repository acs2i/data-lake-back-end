import express, { Request, Response } from "express"
import { TAG } from "./shared"
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import { generalLimits } from "../../services/generalServices"
import TagGroupingModel, {TagGrouping} from "../../schemas/tagGroupingSchema"
import TagModel, { Tag } from "../../schemas/tagSchema"
import { OK } from "../../codes/success"

const router = express.Router()

router.get(TAG, async(req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        await TagGroupingModel.find()

        const data: Tag[] | null | undefined = await TagModel.find().skip(skip).limit(intLimit).populate("tag_grouping_id")

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await TagModel.countDocuments({});

        res.status(OK).json({ data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

router.get(TAG + "/:id", async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Document | null | undefined = await TagModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: Document was null or undefined");
            return;
        }

        res.status(OK).json(document)

    }
    catch(err) {
        console.error(err)
    }


})


export default router