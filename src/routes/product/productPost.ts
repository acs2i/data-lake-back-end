import express, { Request, Response } from "express"
import ProductModel, { Product } from "../../schemas/productSchema";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import UvcModel, { Uvc } from "../../schemas/uvcSchema";

const router = express.Router();


router.post(PRODUCT, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        // expects product 
        const product = req.body;

        if(!product) {
            throw new Error(req.originalUrl + ", msg: product was falsy: " + product)
        }
        
        // create the uvc first
        const {uvc} = product;

        if(!uvc) {
            throw new Error(req.originalUrl + " msg: There was no uvc present in the product object " + product)
        }

        const uvc_ids = []

        for(const u of uvc) {
            // Make sure ean doesn't exist
            const eans = u.eans;

            // if they exist, check that they aren't already created
            if(eans) {
                const foundEan: Uvc | null | undefined = await UvcModel.findOne({ eans: {$in: [...eans] }})

                if(foundEan) {
                    throw new Error(req.originalUrl + "msg: Ean already exists: " + uvc)
                }

            } else {
                // Get the current timestamp in milliseconds
                const timestamp = Date.now();
            
                // Generate a small random number (up to 3 digits)
                const randomSuffix = Math.floor(Math.random() * 1000); // 000 to 999
            
                // Combine timestamp and random suffix
                const combinedNumber = `${timestamp}${randomSuffix}`;
            
                // Ensure the number is exactly 13 digits long by taking the last 13 digits
                const unique13DigitNumber = combinedNumber.slice(-13);  

                u.ean = unique13DigitNumber;
            }
 
            const newUvc: Uvc | null | undefined = await new UvcModel({...u});

            if(!newUvc) {
                // Undo the uvcs that were already created
                for(const _id of uvc_ids) {
                    await UvcModel.deleteOne({_id})
                    console.log("Uvc with this model deleted! ", _id)
                }

                throw new Error(req.originalUrl + " msg: uvc save did not work for some reason: " + uvc)
            }


            await newUvc.save({timestamps: true})

            const {_id} = newUvc;

            uvc_ids.push(_id)
    
        }

        const newProduct: Product | null | undefined = await new ProductModel({...product, uvc_ids, version: 1});

        if(!newProduct) {
            // undo the uvcs that may have already been created
            for(const _id of uvc_ids) {
                await UvcModel.deleteOne({_id})
                console.log("Uvc with this model deleted! ", _id)
            }

            throw new Error(req.originalUrl + " msg: product save did not work for some reason: " + product);
        }

        const savedProduct: Product | null | undefined = await newProduct.save({timestamps: true});
    
        res.status(OK).json(savedProduct);
        
    }
    catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }



})

export default router;