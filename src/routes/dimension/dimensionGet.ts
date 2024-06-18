import express, { Request, Response } from "express"
import { DIMENSION } from "./shared";
import DimensionModel, { Dimension } from "../../schemas/dimensionSchema";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

router.get(DIMENSION + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {

        const {intLimit, skip} = await generalLimits(req);


        let filter: any = { $and: [] }  // any to make typescript stop complaining
        
        const label = req.query.label;

        if(!label) {
            throw new Error(req.originalUrl + ", msg: Label was falsy. Probably means label was undefined")
        }

        const regEx = new RegExp(label as string, "i");

        filter.$and.push({ label: regEx })

        const data  = await DimensionModel.find(filter).skip(skip).limit(intLimit).populate("dimension_type_id");;
        
        const total = await DimensionModel.countDocuments(filter);

        res.status(OK).send({ data , total})

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})


router.get(DIMENSION, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const {skip, intLimit} = await generalLimits(req);

        const data: Dimension[] | null | undefined = await DimensionModel.find().skip(skip).limit(intLimit).populate("dimension_type_id");

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await DimensionModel.countDocuments({});

        res.status(OK).json({ data, total})
        
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})

router.get(DIMENSION + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const data: Dimension | null | undefined = await DimensionModel.findById(id).populate("dimension_type_id");


        if ( data === null ||  data === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: data was null or undefined");
            return;
        }

        res.status(OK).json(data)

    }
    catch(err) {
        res.status(BAD_REQUEST).json(err)
        console.error(err)
    }


})


export default router;