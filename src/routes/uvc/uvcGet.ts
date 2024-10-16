import { Document } from "mongoose";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import UvcModel, { Uvc } from "../../schemas/uvcSchema";
import { generalLimits } from "../../services/generalServices";
import { UVC } from "./shared";
import { Request, Response } from "express";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import express from "express"

const router = express.Router();

router.get(UVC + "/search",async(req: Request, res: Response) => {
    try {
        
        const {intLimit, skip} = await generalLimits(req);

        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const {code} = req.query
    
    
        if(code) {
            const regEx = new RegExp(code as string, "i");
            filter.$and.push({ code: regEx })
        } else {
            throw new Error("No code found")
        }


        const data: Uvc[] | null | undefined = await UvcModel.find(filter).skip(skip).limit(intLimit);
        
        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await UvcModel.countDocuments(filter);

        res.status(200).json({data, total});
    
    } catch(err) {
      console.error(err)
      res.status(500).json(err);
    }
  })

router.get(UVC, authorizationMiddlewear, async( req: Request, res: Response) => {
    try {

        const {skip, intLimit} = await generalLimits(req);

        const data: Document[] | null | undefined = await UvcModel.find().skip(skip).limit(intLimit);

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

       
        const total = await UvcModel.countDocuments({});

        res.status(OK).json({ data, total})


    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})


export default router;