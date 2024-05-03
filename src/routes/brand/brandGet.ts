import express, { Request, Response } from "express"
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { BRAND } from "./shared";
import BrandModel from "../../schemas/brandSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

/* ADD THE SEARCH FOR YX_CODE, YX_LIBELLE */
router.get(BRAND + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {
        
        const { intLimit } = await generalLimits(req);

        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const YX_CODE = req.query.YX_CODE;

        if(YX_CODE) {
            const regEx = new RegExp(YX_CODE as string, "i");
            filter.$and.push({ YX_CODE: regEx })
        }

        const YX_LIBELLE = req.query.YX_LIBELLE;

        if(YX_LIBELLE) {
            const regEx = new RegExp(YX_LIBELLE as string, "i");
            filter.$and.push({ YX_LIBELLE: regEx })
        }


        if(!YX_CODE && !YX_LIBELLE) {
            throw new Error(req.originalUrl + ", msg: All of the parameters were falsy. Probably means they were undefined")
        }


        const data: Document[] | null | undefined = await BrandModel.find(filter).limit(intLimit);


        if (!data) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await BrandModel.countDocuments(filter);


        res.status(OK).json({data, total})

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})

router.get(BRAND, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {
     
        const {skip, intLimit} = await generalLimits(req);

        const documents: Document[] | null | undefined = await BrandModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await BrandModel.countDocuments({});

        res.status(OK).json({ data: [...documents], total})
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


router.get(BRAND + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Document | null | undefined = await BrandModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: Document was null or undefined");
            return;
        }

        res.status(OK).json(document)

    }
    catch(err) {
        res.status(BAD_REQUEST).json(err)
        console.error(err)
    }


})




export default router;  