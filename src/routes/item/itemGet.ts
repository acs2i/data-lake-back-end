import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";
import { ITEM } from "./shared";
import { OK } from "../../codes/success";
import ItemModel, { Item } from "../../schemas/itemSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import SupplierModel from "../../schemas/supplierSchema";

const router = express.Router();

router.get(ITEM +"/search", authorizationMiddlewear, async (req: Request, res: Response)  => {
    try {

        const {intLimit, skip} = await generalLimits(req);

        const {supplier_label, currency, ean, price} = req.query

        let suppliers = undefined;

        if(supplier_label) {
            // lets do the check agains the label
            suppliers = await SupplierModel.find({ label: { $regex: supplier_label as string }}).skip(skip).limit(intLimit)
        }

        if(currency) {
            
        }

        if (ean) {

        }

        if(price) {

        }

        if(!supplier_label && !currency && !ean && !price) {
            throw new Error(req.originalUrl + ", msg: Every possible search query was falsy.")
        }

        const data: Item[] | null | undefined = await ItemModel.find().skip(skip).limit(intLimit).populate("supplier_id");


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})

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