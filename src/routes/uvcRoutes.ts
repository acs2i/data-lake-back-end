import express, { Request, Response } from "express";
import dotenv from "dotenv"
import authorizationMiddlewear from "../middlewears/applicationMiddlewear";
import { Document, ObjectId } from "mongodb";
import { OK } from "../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../codes/errors";
import { UVC } from "../interfaces/resultInterfaces";
import {  uvcGetOnParam, uvcPatchOnParam } from "../services/uvcServices";
import UVCModel from "../schemas/uvcSchema";
import { UpdateWriteOpResult } from "mongoose";
dotenv.config();

const router = express.Router();
const path = "/uvc"

//////////////////////////////////////////////////////////////////////////////////////////////////////
// GET
//////////////////////////////////////////////////////////////////////////////////////////////////////

router.get(path, authorizationMiddlewear, async ( req: Request, res: Response) => {
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


        const documents: Document[] | null | undefined = await UVCModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + ", msg: find error")
        }


        // const results : UVC[] = await uvcGetPriceDocument(documents);


        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})

// Works with price workaround
router.get(path + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(path + "/id/:id, msg: id was: " + id)
        }

        const document: Document | null | undefined = await UVCModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            return;
        }

        // const results : UVC[] = await uvcGetPriceDocument(document);

        res.status(OK).json(document)

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.get(path + "/k/:k", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const k: string | undefined | null = req.params.k;

        
        if(k === null || k === undefined) {
            throw new Error(path + "/k/:k, msg: k was: " + k)
        }

        const documents: Document[] | null | undefined = await uvcGetOnParam(req, k, "k")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/k/:k, msg: find error")
        }

        // const results : UVC[] = await uvcGetPriceDocument(documents);


        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})


router.get(path + "/color/:color", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const color: string | undefined | null = req.params.color;

        
        if(color === null || color === undefined) {
            throw new Error(path + "/color/:color, msg: color was: " + color)
        }

        const documents: Document[] | null | undefined = await uvcGetOnParam(req, color, "color")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/color/:color, msg: find error")
        }

        // const results : UVC[] = await uvcGetPriceDocument(documents);


        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})


router.get(path + "/size/:size", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        console.log("req.params", req.params) 
        const size: string | undefined | null = req.params.size;

        
        if(size === null || size === undefined) {
            throw new Error(path + "/size/:size, msg: size was: " + size)
        }

        const documents: Document[] | null | undefined = await uvcGetOnParam(req, size, "size")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/size/:size, msg: find error")
        }

        // const results : UVC[] = await uvcGetPriceDocument(documents);


        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})

//////////////////////////////////////////////////////////////////////////////////////////////////////
// POST
//////////////////////////////////////////////////////////////////////////////////////////////////////
router.post(path, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {
        const newDocument = new UVCModel({ ...req.body });

        const response = newDocument.save({timestamps: true});
    
        if(response) {
            res.status(OK).send(response);
        } else {
            throw new Error(req.originalUrl + ", msg: save did not work for some reason : " + req.body )
        }
    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }
})


//////////////////////////////////////////////////////////////////////////////////////////////////////
// PATCH
//////////////////////////////////////////////////////////////////////////////////////////////////////

router.patch(path + "/k/:id", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/k/:id, msg: id was: " + id)
        }

        const k: string | undefined | null = req.body.k;

        if(k === null || k === undefined) {
            throw new Error(path + "/k/:id, msg: k was: " + k)
        }

        const response: UpdateWriteOpResult = await uvcPatchOnParam("_id", id, "k", k);

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


router.patch(path + "/color/:id", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/color/:id, msg: id was: " + id)
        }

        const color: string | undefined | null = req.body.color;

        if(color === null || color === undefined) {
            throw new Error(path + "/color/:id, msg: color was: " + color)
        }

        const response: UpdateWriteOpResult = await uvcPatchOnParam("_id", id, "color", color);

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and color was : " + color)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.patch(path + "/size/:id", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/size/:id, msg: id was: " + id)
        }

        const size: string | undefined | null = req.body.size;

        if(size === null || size === undefined) {
            throw new Error(path + "/size/:id, msg: size was: " + size)
        }

        const response: UpdateWriteOpResult = await uvcPatchOnParam("_id", id, "size", size);

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

router.patch(path + "/ean/:id", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/ean/:id, msg: id was: " + id)
        }

        const eans: string | undefined | null = req.body.eans;

        if(eans === null || eans === undefined) {
            throw new Error(path + "/eans/:id, msg: ean was: " + eans)
        }

        const response: UpdateWriteOpResult = await uvcPatchOnParam("_id", id, "eans", eans);

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and ean was : " + eans)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})


// JAKE - MUST ADD A CALL TO STORE IMAGES LATER
router.patch(path + "/image/:id", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/images/:id, msg: id was: " + id)
        }

        const images: string | undefined | null = req.body.images;

        if(images === null || images === undefined) {
            throw new Error(path + "/images/:id, msg: images was: " + images)
        }

        const response: UpdateWriteOpResult = await uvcPatchOnParam("_id", id, "images", images);

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and image was : " + images)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.patch(path + "/price/:id", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/prices/:id, msg: id was: " + id)
        }

        const prices: string | undefined | null = req.body.prices;

        if(prices === null || prices === undefined) {
            throw new Error(path + "/prices/:id, msg: prices was: " + prices)
        }

        const response: UpdateWriteOpResult = await uvcPatchOnParam("_id", id, "prices", prices);

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and price was : " + prices)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})


//////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE
//////////////////////////////////////////////////////////////////////////////////////////////////////

router.delete(path + "/:id" , authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/uvc/:id, msg: id was: " + id)
        }

        const response = await UVCModel.deleteOne({ _id: id});
        
        if(response) {
            res.status(OK).send(response);
        } else {
            throw new Error(path + "/uvc, msg: delete did not work for some reason : " + id )
        }


    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})







export default router;