import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { CLASS } from "./shared";
import { OK } from "../../codes/success";
import ClassificationModel from "../../schemas/classificationSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { Document } from "mongoose";
import ClassModel from "../../schemas/classSchema";

const router = express.Router();

router.post(CLASS, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
       const classObj = req.body;

       if(!classObj) {
            throw new Error(req.originalUrl + ", msg: classObj was falsy: " + classObj)
        }

        const newClass: Document | null | undefined = await new ClassModel({...classObj, GA_VERSION: 1});

        if(!newClass) {
            throw new Error(req.originalUrl + " msg: newClass save did not work for some reason: " + newClass);
        }

        const savedClass: Document | null | undefined = await newClass.save({timestamps: true});

        res.status(OK).json(savedClass);
        

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;