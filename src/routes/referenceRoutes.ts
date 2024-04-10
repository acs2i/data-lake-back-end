import express, { Request, Response } from "express";
import dotenv from "dotenv"
import applicationAuthorization from "../middlewears/applicationMiddlewear";
import ReferenceModel from "../schemas/referenceSchema";
import { Document } from "mongodb";
import { OK } from "../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../codes/errors";
import { ResultReference } from "../interfaces/resultInterfaces";
import { referenceGetPriceDocument, referenceGetOnParam, referencePatchOnParam } from "../services/referenceServices";
import { UpdateWriteOpResult } from "mongoose";
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


        const results : ResultReference[] = await referenceGetPriceDocument(documents);


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
            throw new Error(path + "/reference/id/:id, msg: id was: " + id)
        }

        const document: Document | null | undefined = await ReferenceModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            return;
        }

        const results : ResultReference[] = await referenceGetPriceDocument(document);

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

        const documents: Document[] = await referenceGetOnParam(req, family, "family")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference/family/:family, msg: family was: " + family + " and find return a null or undefined answer")
        } 


        if ( documents.length === 0) {
            res.status(OK).json({});
            return;
        } 

        // set up results to receive both the document object, and the priceId object
        const results : ResultReference[] = await referenceGetPriceDocument(documents);

        res.status(OK).json(results);

    }
    catch(err) {
        res.status(BAD_REQUEST).json({})
        console.error(err)
    }

})

// Works with price workaround
router.get(path + "/k/:k", applicationAuthorization, async (req: Request, res: Response) => {
    try {

        const k: string | undefined | null = req.params.k;

        if(k === null || k === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(path + "/reference/k/:k, msg: k was: " + k)
        }

        const documents: Document[] = await referenceGetOnParam(req, k, "k");


        if ( documents === null ||  documents === undefined) {
            res.status(OK).json({});
            return;
        }

        const results : ResultReference[] = await referenceGetPriceDocument(documents);

        res.status(OK).json(results)

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.get(path + "/v/:v", applicationAuthorization, async (req: Request, res: Response) => {
    try {

        const v: string | undefined | null = req.params.v;

        if(v === null || v === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(path + "/reference/v/:v, msg: v was: " + v)
        }

        const documents: Document[] = await referenceGetOnParam(req, v, "v");


        if ( documents === null ||  documents === undefined) {
            res.status(OK).json({});
            return;
        }

        const results : ResultReference[] = await referenceGetPriceDocument(documents);

        res.status(OK).json(results)

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})


/*
    PATCH
*/

router.patch(path + "/k/:id", applicationAuthorization, async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/k/:id, msg: id was: " + id)
        }

        const k: string | undefined | null = req.body.k;

        if(k === null || k === undefined) {
            throw new Error(path + "/reference/k/:id, msg: k was: " + k)
        }

        const response: UpdateWriteOpResult = await referencePatchOnParam("_id", id, "k", k);

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and k was : " + k)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.patch(path + "/v/:id", applicationAuthorization, async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/v/:id, msg: id was: " + id)
        }

        const v: string | undefined | null = req.body.v;

        if(v === null || v === undefined) {
            throw new Error(path + "/reference/v/:id, msg: v was: " + v)
        }

        const response: UpdateWriteOpResult = await referencePatchOnParam("_id", id, "v", v);

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and v was : " + v)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})








export default router;