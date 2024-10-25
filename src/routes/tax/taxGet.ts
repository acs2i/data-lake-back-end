import express, { Request, Response } from "express"
import { TAX } from "../tax/shared"
import { Document } from "mongoose";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import { generalLimits } from "../../services/generalServices"
import TaxModel, {Tax} from "../../schemas/taxSchema"
import { OK } from "../../codes/success"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear"

const router = express.Router()


router.get(TAX, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        const data: Tax[] | null | undefined = await TaxModel.find().sort({ createdAt: -1 }).skip(skip).limit(intLimit)

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await TaxModel.countDocuments({});

        res.status(OK).json({ data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

router.get(TAX + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {

        const {intLimit, skip} = await generalLimits(req);


        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const code = req.query.code;

        if(code) {
            // const regEx = new RegExp(code as string, "i");
            filter.$and.push({ code })
        }
        
        const label = req.query.label;

        if(label) {
            const regEx = new RegExp(label as string, "i");
            filter.$and.push({ label: regEx })
        }

        const status = req.query.status;

        if(status) {
            // const regEx = new RegExp(status as string, "i");
            filter.$and.push({ status })
        }

        const rate = req.query.rate;

        if(rate) {
            const regEx = new RegExp(rate as string, "i");
            filter.$and.push({ rate })
        }
        
        if(!code && !label && !status && !rate) {
            throw new Error(req.originalUrl + ", msg: All of the parameters were falsy. Probably means they were undefined")
        }


        // both the yx code and yx libelle can be very similar, so we should just do an or and a regex in both fields
        const data: Document[] | null | undefined = await TaxModel.find(filter).skip(skip).limit(intLimit);


        if (!data) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await TaxModel.countDocuments(filter);

        res.status(OK).json({data, total})

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})


router.get(TAX + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Tax | null | undefined = await TaxModel.findById(id)

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