import express, { Request, Response } from "express"
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import { generalLimits } from "../../services/generalServices"
import { OK } from "../../codes/success"
import { TARIF } from "./shared"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear"
import TarifModel, { Tarif } from "../../schemas/tarifSchema"

const router = express.Router()

router.get(TARIF + "/search", authorizationMiddlewear,async(req: Request, res: Response) => {
    try {
        
        const {intLimit, skip} = await generalLimits(req);

        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const {code, label} = req.query
    
    
        if(code) {
            const regEx = new RegExp(code as string, "i");
            filter.$and.push({ code: regEx })
        }

        if(label) {
            const regEx = new RegExp(label as string, "i");
            filter.$and.push({ label: regEx })
        }

        if(!code && !label ) {
            throw new Error("Code, label adddress country were all falsy for some reason")
        }

        const data: Tarif[] | null | undefined = await TarifModel.find(filter).skip(skip).limit(intLimit);
        
        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await TarifModel.countDocuments(filter);

        res.status(200).json({data, total});
    
    } catch(err) {
      console.error(err)
      res.status(500).json(err);
    }
  
  
  
  })


router.get(TARIF, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        const data: Tarif[] | null | undefined = await TarifModel.find().skip(skip).limit(intLimit)

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await TarifModel.countDocuments({});

        res.status(OK).json({ data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})


export default router