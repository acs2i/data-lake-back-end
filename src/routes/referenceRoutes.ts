import express, { Request, Response } from "express";
import dotenv from "dotenv"
import ReferenceModel, { Reference } from "../schemas/referenceSchema";
import { Document, ObjectId } from "mongodb";
import { OK } from "../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../codes/errors";
import { referenceGetOnParam, referenceCompletePatch } from "../services/referenceServices";
import { UpdateWriteOpResult } from "mongoose";
import UVCModel from "../schemas/uvcSchema";
dotenv.config();



const router = express.Router();
const path = "/reference"

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// JAKE TO DO - MUST GET ALL UVCS WITH PRODUCTS

// Works with price workaround
router.get(path,  async (req: Request, res: Response) => {
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


        // const results : ResultReference[] = await referenceGetPriceDocument(documents);

        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})

// Works with price workaround
router.get(path + "/:id",  async (req: Request, res: Response) => {
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

        // const results : ResultReference[] = await referenceGetPriceDocument(document);

        res.status(OK).json(document)

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.get(path + "/family/:family",  async (req: Request, res: Response) => {
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
        // const results : ResultReference[] = await referenceGetPriceDocument(documents);

        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(BAD_REQUEST).json({})
        console.error(err)
    }

})

// Works with price workaround
router.get(path + "/k/:k",  async (req: Request, res: Response) => {
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

        // const results : ResultReference[] = await referenceGetPriceDocument(documents);

        res.status(OK).json(documents)

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.get(path + "/v/:v",  async (req: Request, res: Response) => {
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

        // const results : ResultReference[] = await referenceGetPriceDocument(documents);

        res.status(OK).json(documents)

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// POST
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post(path,  async (req: Request, res: Response) => {

    try {
        const {uvc} = req.body;

        const newUvc: Document = await new UVCModel({...uvc});
    
        if(!newUvc) {
            throw new Error(req.originalUrl + " msg: uvc save did not work for some reason: " + req.body);
        }   
    
        const savedUvc = await newUvc.save({timestamps: true});
    
        const uvcId  = savedUvc._id;
    
        const newRef = { ...req.body, uvcs: [uvcId], version: 1 };
    
        const newDocument: Document = new ReferenceModel(newRef);
    
        const response = await newDocument.save({timestamps: true});
    
        if(response) {
            res.status(OK).json(response);
        } else {
            throw new Error(req.originalUrl + ", msg: save did not work for some reason : " + req.body )
        }
    }
    catch(err){
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({})
    }


})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PUT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.put(path,  async( req: Request, res: Response) => {
    try {
        const reference: Reference | undefined |  null = req.body;

        if(reference === undefined || reference === null) {
            throw new Error(req.originalUrl + " msg: PUT reference did not work for some reason: " + req.body);
        }   
    
        const {_id} = reference;
    
        if(_id === undefined || _id === null) {
            throw new Error(req.originalUrl + " msg: _id was missing from req PUT request: " + _id);
        }   
    
    
        const response: UpdateWriteOpResult = await ReferenceModel.updateOne({ _id }, { $set: { ...reference} })

        console.log("reponse: " ,  response)
    
        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(200).json(response)
        } else {
            throw new Error(req.originalUrl + "msg: PUT  reference model update did not work for some reason. Here is the response, id: " + _id + " reference: " + reference)
        }
    }
    catch(err){
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
}) 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   PATCH
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.patch(path + "/k/:id",  async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/k/:id, msg: id was: " + id)
        }

        const k: string | undefined | null = req.body.k;

        if(k === null || k === undefined) {
            throw new Error(path + "/reference/k/:id, msg: k was: " + k)
        }

        // Push old version to reference history table first
        const response : UpdateWriteOpResult | Error = await referenceCompletePatch(req, "_id", id, "k", k);

        if(response instanceof Error) {
            throw response;
        }

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            // Undo newly created version then. No await, client doesn't need to wait for this action to be completed.
            throw new Error(path + "/k/:id, msg: Get back an update write op that was not acceptable somehow. Id was : " + id + " and k was : " + k)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.patch(path + "/v/:id",  async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/v/:id, msg: id was: " + id)
        }

        const v: string | undefined | null = req.body.v;

        if(v === null || v === undefined) {
            throw new Error(path + "/reference/v/:id, msg: v was: " + v)
        }

        const response : UpdateWriteOpResult | Error = await referenceCompletePatch(req, "_id", id, "v", v);

        if(response instanceof Error) {
            throw response;
        }

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

router.patch(path + "/family/:id",  async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/family/:id, msg: id was: " + id)
        }

        const family: string | undefined | null = req.body.family;

        if(family === null || family === undefined) {
            throw new Error(path + "/reference/family/:id, msg: family was: " + family)
        }

        const response : UpdateWriteOpResult | Error = await referenceCompletePatch(req, "_id", id, "family", family);

        if(response instanceof Error) {
            throw response;
        }

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json(req.body)
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and family was : " + family)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.patch(path + "/color/:id",  async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/color/:id, msg: id was: " + id)
        }

        const colors: string | undefined | null = req.body.colors;

        if(colors === null || colors === undefined) {
            throw new Error(path + "/reference/color/:id, msg: colors was: " + colors)
        }

        const response : UpdateWriteOpResult | Error = await referenceCompletePatch(req, "_id", id, "colors", colors);

        if(response instanceof Error) {
            throw response;
        }

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and colors was : " + colors)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})


router.patch(path + "/frnPrincipal/:id",  async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/frnPrincipal/:id, msg: id was: " + id)
        }

        const frnPrincipal: string | undefined | null = req.body.frnPrincipal;

        if(frnPrincipal === null || frnPrincipal === undefined) {
            throw new Error(path + "/reference/frnPrincipal/:id, msg: frnPrincipal was: " + frnPrincipal)
        }

        const response : UpdateWriteOpResult | Error = await referenceCompletePatch(req, "_id", id, "frnPrincipal", new ObjectId(frnPrincipal));

        if(response instanceof Error) {
            throw response;
        }

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and frnPrincipal was : " + frnPrincipal)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})


router.patch(path + "/size/:id",  async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/size/:id, msg: id was: " + id)
        }

        const size: string | undefined | null = req.body.size;

        if(size === null || size === undefined) {
            throw new Error(path + "/reference/size/:id, msg: size was: " + size)
        }

        const response : UpdateWriteOpResult | Error = await referenceCompletePatch(req, "_id", id, "size", size);

        if(response instanceof Error) {
            throw response;
        }

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and size was : " + size)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.patch(path + "/priceId/:id",  async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/priceId/:id, msg: id was: " + id)
        }

        const priceId: string | undefined | null = req.body.priceId;

        if(priceId === null || priceId === undefined) {
            throw new Error(path + "/reference/priceId/:id, msg: priceId was: " + priceId)
        }

        const response : UpdateWriteOpResult | Error = await referenceCompletePatch(req, "_id", id, "priceId", new ObjectId(priceId));

        if(response instanceof Error) {
            throw response;
        }

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and priceId was : " + priceId)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.delete(path + "/:id",  async (req: Request, res: Response) => {
    try {
        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/k/:id, msg: id was: " + id)
        }
    
        const response  = await ReferenceModel.deleteOne({ _id: id});
        
        if(response.acknowledged === true && response.deletedCount === 1 ) {
            res.status(OK).send(response);
        } else {
            throw new Error(req.originalUrl + ", msg: delete did not work for some reason with this id: " + id )
        }
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).send({})
    }
    


})







export default router;