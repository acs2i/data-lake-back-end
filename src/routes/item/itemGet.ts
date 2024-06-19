import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";
import { ITEM } from "./shared";
import { OK } from "../../codes/success";
import ItemModel, { Item } from "../../schemas/itemSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";

const router = express.Router();

router.get(ITEM, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        const data: Item[] | null | undefined = await ItemModel.find().skip(skip).limit(intLimit).populate("supplier_id");

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }
        const total = await ItemModel.countDocuments({});

        res.status(OK).json({ data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;