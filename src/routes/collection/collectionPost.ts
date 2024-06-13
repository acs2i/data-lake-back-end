import express, { Request, Response } from "express"
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { COLLECTION } from "./shared";
import CollectionModel from "../../schemas/collectionSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();


router.post(COLLECTION, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        
        const collection = req.body;

        if(!collection) {
            throw new Error(req.originalUrl + ", msg: collection was falsy: " + collection)
        }

        const newCollection: Document | null | undefined = await new CollectionModel({...collection });

        if(!newCollection) {
            throw new Error(req.originalUrl + " msg: collection save did not work for some reason: " + collection);
        }

        const savedCollection: Document | null | undefined = await newCollection.save({timestamps: true});

        res.status(OK).json(savedCollection);
        
    }
    catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }



})

export default router;