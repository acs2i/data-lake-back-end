import express, { Request, Response } from "express"
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { COLLECTION } from "./shared";
import CollectionModel from "../../schemas/collectionSchema";

const router = express.Router();


router.post(COLLECTION, async (req: Request, res: Response) => {
    try {
        // expects collection 
        const collection = req.body.collection;

        if(!collection) {
            throw new Error(req.originalUrl + ", msg: collection was falsy: " + collection)
        }

        const newCollection: Document | null | undefined = await new CollectionModel({...collection });

        if(!newCollection) {
            throw new Error(req.originalUrl + " msg: collection save did not work for some reason: " + collection);
        }

        const savedCollection: Document | null | undefined = await newCollection.save({timestamps: true});
        
        const _id = savedCollection._id;

        const result = { ...collection, _id}

        res.status(OK).json(result);
        
    }
    catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }



})

export default router;