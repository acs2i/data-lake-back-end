import express, { Request, Response } from "express"
import { DIMENSION } from "./shared";
import DimensionModel from "../../schemas/dimensionSchema";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

router.get(DIMENSION + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {

        const {intLimit, skip} = await generalLimits(req);


        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const GDI_TYPEDIM = req.query.GDI_TYPEDIM;

        if(GDI_TYPEDIM) {
            const regEx = new RegExp(GDI_TYPEDIM as string, "i");
            filter.$and.push({ GDI_TYPEDIM: regEx })
        }

        const GDI_DIMORLI = req.query.GDI_DIMORLI;

        if(GDI_DIMORLI) {
            const regEx = new RegExp(GDI_DIMORLI as string, "i");
            filter.$and.push({ GDI_DIMORLI: regEx })
        }
        
        const GDI_LIBELLE = req.query.GDI_LIBELLE;

        if(GDI_LIBELLE) {
            const regEx = new RegExp(GDI_LIBELLE as string, "i");
            filter.$and.push({ GDI_LIBELLE: regEx })
        }

        if(!GDI_TYPEDIM && !GDI_LIBELLE && !GDI_DIMORLI) {
            throw new Error(req.originalUrl + ", msg: All of the parameters were falsy. Probably means they were undefined")
        }


        const data  = await DimensionModel.find(filter).skip(skip).limit(intLimit);
        const total = await DimensionModel.countDocuments(filter);
       

        res.status(OK).send({ data , total})

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})


router.get(DIMENSION, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const {skip, intLimit} = await generalLimits(req);

        const documents: Document[] | null | undefined = await DimensionModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await DimensionModel.countDocuments({});

        res.status(OK).json({ data: [...documents], total})
        
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})

router.get(DIMENSION + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Document | null | undefined = await DimensionModel.findById(id);


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

// we'll need to fetch the dimension using the id of the product
// but you gotta do this roundabout way of getting it by going to uvc first,
// then using the values of
// "couleur" and "taille" in the uvc collection


export default router;