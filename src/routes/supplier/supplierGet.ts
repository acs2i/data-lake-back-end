import express, { Request, Response } from "express"
import { SUPPLIER } from "./shared";
import SupplierModel, { Supplier } from "../../schemas/supplierSchema";
import { generalLimits } from "../../services/generalServices";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { BAD_REQUEST } from "../../codes/errors";
import { OK } from "../../codes/success";

const router = express.Router();

router.get(SUPPLIER + "/search", authorizationMiddlewear,async(req: Request, res: Response) => {
    try {
        
        const {intLimit, skip} = await generalLimits(req);

        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const {code, label, juridique, status} = req.query
    
    
        if(code) {
            const regEx = new RegExp(code as string, "i");
            filter.$and.push({ code: regEx })
        }

        if(label) {
            const regEx = new RegExp(label as string, "i");
            filter.$and.push({ label: regEx })
        }

        if(juridique) {
            const regEx = new RegExp(juridique as string, "i");
            filter.$and.push({ juridique: regEx })
        }
        
        if(status) {
            const regEx = new RegExp(status as string, "i");
            filter.$and.push({ status: regEx })
        }


        const data: Supplier[] | null | undefined = await SupplierModel.find(filter).skip(skip).limit(intLimit);
        
        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await SupplierModel.countDocuments(filter);

        res.status(200).json({data, total});
    
    } catch(err) {
      console.error(err)
      res.status(500).json(err);
    }
  
  
  
  })


router.get(SUPPLIER, authorizationMiddlewear,async (req: Request, res: Response) => {
    try {

        const {intLimit, skip} = await generalLimits(req);

        const data: Supplier[] | null | undefined = await SupplierModel.find().skip(skip).limit(intLimit);
    
                
        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await SupplierModel.countDocuments({});
        
        res.status(200).json({data, total});

    } catch(err) {
      console.error(err)
      res.status(500).json(err);
    }
  
  
  })

router.get(SUPPLIER + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Document | null | undefined = await SupplierModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: Document was null or undefined");
            return;
        }

        res.status(OK).json(document)

    }
    catch(err) {
        res.status(BAD_REQUEST).json(err)
        console.error(err)
    }


})
    


export default router;