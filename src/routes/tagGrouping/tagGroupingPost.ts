import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { TAG_GROUPING } from "./shared";
import { OK } from "../../codes/success";
import TagGroupingModel from "../../schemas/tagGroupingSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { Document } from "mongoose";

const router = express.Router();

router.post(TAG_GROUPING, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
       const object = req.body;

       if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }

        const newObject: Document | null | undefined = await new TagGroupingModel({...object, GA_VERSION: 1});

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: newobject save did not work for some reason: " + newObject);
        }

        const savedObject: Document | null | undefined = await newObject.save({timestamps: true});

        res.status(OK).json(savedObject);
        

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;