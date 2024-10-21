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

        const status = req.query.status as string;
        let eans = req.query.eans as any
    

        console.log("eans: "  ,eans)
        
        if(eans && eans.length > 0) {


            // lets see if first one can be decoded to determine
            let canDecode: boolean; 

            try {
                JSON.parse(eans);
                canDecode = true;
            } catch(err) {
                canDecode = false;
            }
           

            // If can decode is equal to true, then it is an array of objects can we should determine what the 
            // operators are
            /**
             *  
             *  determine if it is just strings or an object, if its an object its will contain
             *  {
             *      [property: string] : {
             *          [operator: string] : value
             *      } 
             *  }
             * 
             * 
             *  array of objects
             *  
             *  
            * */

            // If it is an array of objects
            if(canDecode) {

                const parsedEans = JSON.parse(eans)
             
                for(const property in parsedEans) {

                        const operator = parsedEans[property] ; // operator  = property[ean]
                        
                        // add additional properties to this logic structure chain
                        if(property === "length" ) {

                            const eanObj : any= {}

                            // add additional operators to this logic structure chain
                            if(operator["$eq"] !== undefined) {


                                const $size = operator["$eq"];

                                eanObj["$size"] = $size;
                                
                            }

                            filter.$and.push({
                                eans: eanObj
                            })
                           
                        }    
                }
            } 
            // if it is just a string
            else {
                filter.$and.push({ eans: { $in: eans }})
            }
  

        }   
    
        if(status) {
            // const regEx = new RegExp(status as string, "i");
            filter.$and.push({ status })
        } 


        // will throw error if there is no filter so jake write logic to catch this


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