import express, { Request, Response } from "express"
import ProductModel, {  Product } from "../../schemas/productSchema";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

import { productPopulateBrand, productPopulateFamily, productPopulateUvc } from "../../services/productServices";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

router.get(PRODUCT + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {
  
        const { intLimit } = await generalLimits(req);

        const value = req.query.value;

        if(!value) {
            throw new Error(req.originalUrl + ", msg: value in family routes get was falsy: " + value);
        } 

        const filter = { 
            $or: [
                    {
                        GA_LIBCOMPL: { $regex: value as string}
                    },
                    {
                        GA_LIBELLE: { $regex: value as string}
                    }
            ] 
        }
        // both the yx code and yx libelle can be very similar, so we should just do an or and a regex in both fields
        const documents: Product[] | null | undefined = await ProductModel.find(filter).limit(intLimit);


        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        
        let data = await productPopulateUvc(documents);
        data = await productPopulateFamily(data);
        data = await productPopulateBrand(data);

        const total = await ProductModel.countDocuments(filter);

        res.status(OK).json({data, total})

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})

router.get(PRODUCT, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {

        const { skip, intLimit } = await generalLimits(req);

        const documents: Product[] | null | undefined = await ProductModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        let data = await productPopulateUvc(documents);
        data = await productPopulateFamily(data);
        data = await productPopulateBrand(data);
 
        const total = await ProductModel.countDocuments({});

        res.status(OK).json({ data, total})
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


router.get(PRODUCT + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        let document: Product | null | undefined = await ProductModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: Document was null or undefined");
            return;
        }

        let data = await productPopulateUvc(document);
        data = await productPopulateFamily(data);
        data = await productPopulateBrand(data);

        res.status(OK).json(data)

    }
    catch(err) {
        res.status(BAD_REQUEST).json(err)
        console.error(err)
    }


})

export default router;  