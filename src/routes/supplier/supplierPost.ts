import express, { Request, Response } from "express"
import { SUPPLIER } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import { Document } from "mongoose";
import SupplierModel, { Supplier } from "../../schemas/supplierSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();


router.get(SUPPLIER + "/field/:field/id/:id", async (req: Request, res: Response) => {
    try {
        const { value , field } = req.params;

        const data : Supplier[] | null | undefined = await SupplierModel.findOne({[field] : value}); // we find all in case the edge case of different level families with same name
    
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

router.post(SUPPLIER, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const object = req.body;
        
        if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }

        const newObject: Document | null | undefined = await new SupplierModel({...object});

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: object create did not work for some reason: " + object);
        }

        const result: Document | null | undefined = await newObject.save({timestamps: true});

        res.status(OK).json(result)

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;