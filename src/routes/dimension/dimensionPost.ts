import express, { Request, Response } from "express"
import { DIMENSION } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import { Document } from "mongoose";
import DimensionModel from "../../schemas/dimensionSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();


router.post(DIMENSION, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const dimension = req.body;
        
        if(!dimension) {
            throw new Error(req.originalUrl + ", msg: dimension was falsy: " + dimension)
        }

        const newDimension: Document | null | undefined = await new DimensionModel({...dimension});

        if(!newDimension) {
            throw new Error(req.originalUrl + " msg: dimension save did not work for some reason: " + dimension);
        }

        const savedDimension: Document | null | undefined = await newDimension.save({timestamps: true});

        const _id = savedDimension._id;

        const result = { ...dimension, _id};

        res.status(OK).json(result)

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;