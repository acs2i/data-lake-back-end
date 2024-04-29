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

        const value = req.query.value;

        if(!value) {
            throw new Error(req.originalUrl + ", msg: value in family routes get was falsy: " + value);
        } 
        
        const { intLimit } = await generalLimits(req);

        const filter =  { 
            $or: [
                    {
                        YX_CODE: { $regex: value as string}
                    },
                    {
                        YX_LIBELLE: { $regex: value as string}
                    }
                ] 
        }


            // both the yx code and yx libelle can be very similar, so we should just do an or and a regex in both fields
        const data: Document[] | null | undefined = await BrandModel.find(filter).limit(intLimit);


        if ( !data) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await BrandModel.countDocuments({});


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