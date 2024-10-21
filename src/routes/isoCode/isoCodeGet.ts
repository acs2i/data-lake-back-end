import express, { Request, Response } from 'express';
import { Router } from 'express';
import { generalLimits } from '../../services/generalServices';
import IsoModel, { IsoCode } from '../../schemas/isoSchema';
import { OK } from '../../codes/success';
import { INTERNAL_SERVER_ERROR } from '../../codes/errors';
import authorizationMiddlewear from '../../middlewears/applicationMiddlewear';

const router: Router = express.Router();
const ISO_CODE = "/iso-code"

router.get(ISO_CODE + "/search",async(req: Request, res: Response) => {
    try {
        
        const {intLimit, skip} = await generalLimits(req);

        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const {iso1, iso2, iso3, countryName} = req.query
    
        if(countryName) {
            const regEx = new RegExp(countryName as string, "i");
            filter.$and.push({ countryName: regEx })
        }

        console.log("filter: "  ,filter)
    
        if(iso1) {
            const regEx = new RegExp(iso1 as string, "i");
            filter.$and.push({ iso1: regEx })
        }

        if(iso2) {
            const regEx = new RegExp(iso2 as string, "i");
            filter.$and.push({ iso2: regEx })
        }

        if(iso3) {
            const regEx = new RegExp(iso3 as string, "i");
            filter.$and.push({ iso3: regEx })
        }

        const data: IsoCode[] | null | undefined = await IsoModel.find(filter).skip(skip).limit(intLimit);
        
        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await IsoModel.countDocuments(filter);

        res.status(200).json({data, total});
    
    } catch(err) {
      console.error(err)
      res.status(500).json(err);
    }
  
  
  
})


router.get(ISO_CODE, async(req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        const data: IsoCode[] | null | undefined = await IsoModel.find().skip(skip).limit(intLimit)

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await IsoModel.countDocuments({});

        res.status(OK).json({ data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})


router.get(ISO_CODE + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: IsoCode | null | undefined = await IsoModel.findById(id);

        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: Document was null or undefined");
            return;
        }

        res.status(OK).json(document)

    }
    catch(err) {
        console.error(err)
    }


})

export default router;
