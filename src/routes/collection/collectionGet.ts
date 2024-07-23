import express, { Request, Response } from "express"
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { COLLECTION } from "./shared";
import CollectionModel from "../../schemas/collectionSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

router.get(COLLECTION + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {

        const {intLimit, skip} = await generalLimits(req);


        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const code = req.query.code;

        if(code) {
            const regEx = new RegExp(code as string, "i");
            filter.$and.push({ code: regEx })
        }
        
        const label = req.query.label;

        if(label) {
            const regEx = new RegExp(label as string, "i");
            filter.$and.push({ label: regEx })
        }

        const type = req.query.type;

        if(type) {
            const regEx = new RegExp(type as string, "i");
            filter.$and.push({ type: regEx })
        }
        
        if(!code && !label && !type) {
            throw new Error(req.originalUrl + ", msg: All of the parameters were falsy. Probably means they were undefined")
        }


        // both the yx code and yx libelle can be very similar, so we should just do an or and a regex in both fields
        const data: Document[] | null | undefined = await CollectionModel.find(filter).skip(skip).limit(intLimit);


        if (!data) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await CollectionModel.countDocuments(filter);

        res.status(OK).json({data, total})

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})

router.get(COLLECTION, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {
     
        const {skip, intLimit} = await generalLimits(req);

        const documents: Document[] | null | undefined = await CollectionModel.find().sort({ createdAt: -1 }).skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await CollectionModel.countDocuments({});

        res.status(OK).json({ data: [...documents], total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


router.get(COLLECTION + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Document | null | undefined = await CollectionModel.findById(id);


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