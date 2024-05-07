import express, { Request, Response } from "express"
import { GRID } from "./shared";
import GridModel from "../../schemas/gridSchema";
import { generalLimits } from "../../services/generalServices";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import authorizationMiddlewear from '../../middlewears/applicationMiddlewear';

const router = express.Router();

router.get(GRID, authorizationMiddlewear, async (req: Request, res: Response) => {

    try {

        const {skip, intLimit} = await generalLimits(req);

        const documents: Document[] | null | undefined = await GridModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

       
        const total = await GridModel.countDocuments({});

        res.status(OK).json({ data: [...documents], total})


    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})

export default router;