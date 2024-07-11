import express, { Request, Response } from "express"
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { CLIENT } from "./shared";
import ClientModel from "../../schemas/clientSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();


router.get(CLIENT + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {
        
        const { intLimit , skip} = await generalLimits(req);
        
        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const type = req.query.type;


        if(!type) {
            throw new Error(req.originalUrl + ", msg: type was falsy. Probably means it was undefined")
        }

        const regEx = new RegExp(type as string, "i");
        filter.$and.push({ type: regEx })

        const data: Document[] | null | undefined = await ClientModel.find(filter).skip(skip).limit(intLimit);


        if (!data) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await ClientModel.countDocuments(filter);


        res.status(OK).json({data, total})

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})

router.get(CLIENT, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {

     
        const {skip, intLimit} = await generalLimits(req);

        const documents: Document[] | null | undefined = await ClientModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await ClientModel.countDocuments({});

        res.status(OK).json({ data: [...documents], total})
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


router.get(CLIENT + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Document | null | undefined = await ClientModel.findById(id);


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