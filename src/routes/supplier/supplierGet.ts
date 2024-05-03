import express, { Request, Response } from "express"
import { SUPPLIER } from "./shared";
import SupplierModel, { Supplier } from "../../schemas/supplierSchema";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

router.get(SUPPLIER + "/search", async(req: Request, res: Response) => {
    try {
        
        const {intLimit, skip} = await generalLimits(req);

        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const {T_TIERS, T_LIBELLE, T_JURIDIQUE, T_FERME, T_TELEPHONE, T_EMAIL} = req.query
    
    
        if(T_TIERS) {
            const regEx = new RegExp(T_TIERS as string, "i");
            filter.$and.push({ T_TIERS: regEx })
        }

        if(T_LIBELLE) {
            const regEx = new RegExp(T_LIBELLE as string, "i");
            filter.$and.push({ T_LIBELLE: regEx })
        }

        if(T_JURIDIQUE) {
            const regEx = new RegExp(T_JURIDIQUE as string, "i");
            filter.$and.push({ T_JURIDIQUE: regEx })
        }
        
        if(T_FERME) {
            const regEx = new RegExp(T_FERME as string, "i");
            filter.$and.push({ T_FERME: regEx })
        }

        if(T_TELEPHONE) {
            const regEx = new RegExp(T_TELEPHONE as string, "i");
            filter.$and.push({ T_TELEPHONE: regEx })
        }

        
        if(T_EMAIL) {
            const regEx = new RegExp(T_EMAIL as string, "i");
            filter.$and.push({ T_EMAIL: regEx })
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


export default router;