import express, { Request, Response } from "express"
import ProductModel from "../../schemas/productSchema";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();

router.get(PRODUCT + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {
        const limit: string | any | string[] | undefined = req.query.limit;

        let intLimit;

        if(!limit) {
            intLimit = 1000;        
        } else {
            intLimit = parseInt(limit); 
        }        

        const value = req.query.value;

        if(!value) {
            throw new Error(req.originalUrl + ", msg: value in family routes get was falsy: " + value);
        } 


        // both the yx code and yx libelle can be very similar, so we should just do an or and a regex in both fields
        const documents: Document[] | null | undefined = await ProductModel.find(
            { 
                $or: [
                        {
                            GA_LIBCOMPL: { $regex: value as string}
                        },
                        {
                            GA_LIBELLE: { $regex: value as string}
                        }
                    ] 
            }
        ).limit(intLimit);


        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        res.status(OK).json(documents)

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})

router.get(PRODUCT, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {
        const page: string | any | string[] | undefined = req.query.page;
        const limit: string | any | string[] | undefined = req.query.limit;

        let intPage;
        let intLimit;

        if(page === undefined) {
            intPage = 1;
        } else {
            intPage = parseInt(page) 
        }


        if(limit === undefined) {
            intLimit = 1000;        
        } else {
            intLimit = parseInt(limit); 
        }        

        const skip = (intPage - 1) * intLimit;

        const documents: Document[] | null | undefined = await ProductModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await ProductModel.countDocuments({});

        res.status(OK).json({ data: [...documents], total})
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


router.get(PRODUCT + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Document | null | undefined = await ProductModel.findById(id);


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