import express, { Request, Response } from "express";
import dotenv from "dotenv"
import applicationAuthorization from "../middlewears/applicationMiddlewear";
import ReferenceModel from "../schemas/referenceSchema";
import { Document, ObjectId } from "mongodb";
import { OK } from "../codes/success";
import mongoose  from "mongoose";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../codes/errors";
import PriceModel, { Price } from "../schemas/priceSchema";
import { ResultReference } from "../interfaces/resultInterfaces";
import { fetchPriceModel } from "../utilities/referenceUtilities";
dotenv.config();



const router = express.Router();
const path = "/reference"

// Works with price workaround
router.get(path, applicationAuthorization, async (req: Request, res: Response) => {
    try {

        const page: string | any | string[] | undefined = req.query.page;
        const limit: string | any | string[] | undefined = req.query.limit;

        let intPage;
        let intLimit;

        if(page === undefined) {
            intPage = 1;
        } else {
            intPage = parseInt(page) 
        }


        if(limit === undefined) {
            intLimit = 1000;        
        } else {
            intLimit = parseInt(limit); 
        }        

        const skip = (intPage - 1) * intLimit;


        const documents: Document[] | null | undefined = await ReferenceModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference, msg: find error")
        }


        const results : ResultReference[] = await fetchPriceModel(documents);


        res.status(OK).json(results);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})


// Works with price workaround
router.get(path + "/:id", applicationAuthorization, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(path + "/reference/:id, msg: id was: " + id)
        }

        const document: Document | null | undefined = await ReferenceModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            return;
        }

        const results : ResultReference[] = await fetchPriceModel(document);

        res.status(OK).json(results)

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.get(path + "/family/:family", applicationAuthorization, async (req: Request, res: Response) => {
    try {

        const family: string | undefined | null = req.params.family;

        if(family === null || family === undefined) {
            throw new Error(path + "/reference/:family, msg: family was: " + family)
        }

        const page: string | any | string[] | undefined = req.query.page;
        const limit: string | any | string[] | undefined = req.query.limit;

        let intPage;
        let intLimit;

        if(page === undefined) {
            intPage = 1;
        } else {
            intPage = parseInt(page) 
        }


        if(limit === undefined) {
            intLimit = 1000;        
        } else {
            intLimit = parseInt(limit); 
        }        

        const skip = (intPage - 1) * intLimit;


        const documents: Document[] | null | undefined = await ReferenceModel.find({family}).skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference/family/:family, msg: family was: " + family + " and find return a null or undefined answer")
        } 


        if ( documents.length === 0) {
            res.status(OK).json({});
            return;
        } 

        // set up results to receive both the document object, and the priceId object
        const results : ResultReference[] = await fetchPriceModel(documents);

        res.status(OK).json(results);

    }
    catch(err) {
        res.status(BAD_REQUEST).json({})
        console.error(err)
    }

})




export default router;