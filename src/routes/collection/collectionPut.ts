import express, { Request, Response } from "express"
import { COLLECTION } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import CollectionModel from "../../schemas/collectionSchema";

const router = express.Router();

router.put(COLLECTION, async ( req: Request, res: Response) => {
    try {

        const collection = req.body;

        if(!collection) {
            throw new Error(req.originalUrl + ", msg: collection was falsy: " + collection)
        }

        const {_id} = collection;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id)
        }

        const response: UpdateWriteOpResult = await CollectionModel.updateOne({ _id}, {$set: collection })

        console.log(response)

        if (response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json(collection)
        } else{
            throw new Error(req.originalUrl + ", msg: There was a response that didn't match the needed criteria: "+response.acknowledged+" " +response.matchedCount+" "+response.modifiedCount)
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

export default router;
