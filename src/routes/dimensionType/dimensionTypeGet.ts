import express, { Request, Response } from "express"
import { DIMENSION_TYPE } from "./shared";
import DimensionTypeModel, { DimensionType } from "../../schemas/dimensionTypeSchema";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

router.get(DIMENSION_TYPE + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {

        const {intLimit, skip} = await generalLimits(req);


        let filter: any = { $and: [] }  // any to make typescript stop complaining
        
        const dimension = req.query.dimension;

        if(dimension) {
            const regEx = new RegExp(dimension as string, "i");

            filter.$and.push({ dimension: regEx })
        }


        if(!dimension) {
            throw new Error(req.originalUrl + ", msg: dimension were falsy. Probably means dimension were undefined")
        }

        const data  = await DimensionTypeModel.find(filter).skip(skip).limit(intLimit)
        
        const total = await DimensionTypeModel.countDocuments(filter);

        res.status(OK).send({ data , total})

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})


router.get(DIMENSION_TYPE, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const {skip, intLimit} = await generalLimits(req);

        const data: DimensionType[] | null | undefined = await DimensionTypeModel.find().skip(skip).limit(intLimit);

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await DimensionTypeModel.countDocuments({});

        res.status(OK).json({ data, total})
        
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})

router.get(DIMENSION_TYPE + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const data: DimensionType | null | undefined = await DimensionTypeModel.findById(id);


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