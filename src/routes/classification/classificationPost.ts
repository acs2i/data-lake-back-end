import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { CLASSIFICATION } from "./shared";
import { OK } from "../../codes/success";
import ClassificationModel from "../../schemas/classificationSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { Document } from "mongoose";

const router = express.Router();

router.post(CLASSIFICATION, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
       const classification = req.body;

       if(!classification) {
            throw new Error(req.originalUrl + ", msg: classification was falsy: " + classification)
        }

        const newClassification: Document | null | undefined = await new ClassificationModel({...classification, GA_VERSION: 1});

        if(!newClassification) {
            throw new Error(req.originalUrl + " msg: newClassification save did not work for some reason: " + newClassification);
        }

        const savedClassification: Document | null | undefined = await newClassification.save({timestamps: true});

        res.status(OK).json(savedClassification);
        

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;