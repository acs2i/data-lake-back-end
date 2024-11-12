import express, { Request, Response } from "express"
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { BRAND } from "./shared";
import BrandModel, { Brand } from "../../schemas/brandSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

router.get(BRAND + "/field/:field/value/:value", async (req: Request, res: Response) => {
    try {
        const { value , field } = req.params;

        console.log("value:  "  , value, " and filedl: "  , field)
        const data : Brand[] | null | undefined = await BrandModel.find({[field] : value}); // we find all in case the edge case of different level families with same name
    
        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }
        
        res.status(OK).json(data);
    }
    catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }

})

router.get(BRAND + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {
        
        const { intLimit , skip} = await generalLimits(req);
        
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

        const status = req.query.status;
        
        if(status) {
            const regEx = new RegExp(status as string, "i");
            filter.$and.push({ status: regEx })
        }


        if(!code && !label && !status) {
            throw new Error(req.originalUrl + ", msg: All of the parameters were falsy. Probably means they were undefined")
        }


        const data: Document[] | null | undefined = await BrandModel.find(filter).skip(skip).limit(intLimit);


        if (!data) {
            throw new Error(req.originalUrl + ", msg: find error")
        }
        console.log("counts total of filter: " , req.query)

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

        const documents: Document[] | null | undefined = await BrandModel.find().sort({ creation_date: -1 }).skip(skip).limit(intLimit);

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