import express, { Request, Response } from "express"
import { TAX } from "../tax/shared"
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