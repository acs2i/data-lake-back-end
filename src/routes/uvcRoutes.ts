import express, { Request, Response } from "express";
import dotenv from "dotenv"
import applicationAuthorization from "../middlewears/applicationMiddlewear";
import { Document } from "mongodb";
import { OK } from "../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../codes/errors";
import { UVC } from "../interfaces/resultInterfaces";
import { uvcReferenceGetPriceDocument, uvcreferenceGetOnParam } from "../services/uvcServices";
import UVCModel from "../schemas/uvcSchema";
dotenv.config();

const router = express.Router();
const path = "/uvc"

router.get(path, applicationAuthorization, async ( req: Request, res: Response) => {
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
            throw new Error(path + "/reference, msg: find error")
        }


        const results : UVC[] = await uvcReferenceGetPriceDocument(documents);


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
            throw new Error(path + "/uvc/id/:id, msg: id was: " + id)
        }

        const document: Document | null | undefined = await UVCModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            return;
        }

        const results : UVC[] = await uvcReferenceGetPriceDocument(document);

        res.status(OK).json(results)

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

router.get(path + "/k/:k", applicationAuthorization, async ( req: Request, res: Response) => {
    try {

        const k: string | undefined | null = req.params.k;

        
        if(k === null || k === undefined) {
            throw new Error(path + "/reference/:k, msg: k was: " + k)
        }

        const documents: Document[] | null | undefined = await uvcreferenceGetOnParam(req, k, "k")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference, msg: find error")
        }

        const results : UVC[] = await uvcReferenceGetPriceDocument(documents);


        res.status(OK).json(results);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})


router.get(path + "/color/:color", applicationAuthorization, async ( req: Request, res: Response) => {
    try {

        const color: string | undefined | null = req.params.color;

        
        if(color === null || color === undefined) {
            throw new Error(path + "/reference/:color, msg: color was: " + color)
        }

        const documents: Document[] | null | undefined = await uvcreferenceGetOnParam(req, color, "color")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference, msg: find error")
        }

        const results : UVC[] = await uvcReferenceGetPriceDocument(documents);


        res.status(OK).json(results);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})


router.get(path + "/size/:size", applicationAuthorization, async ( req: Request, res: Response) => {
    try {

        console.log("req.params", req.params) 
        const size: string | undefined | null = req.params.size;

        
        if(size === null || size === undefined) {
            throw new Error(path + "/reference/:size, msg: size was: " + size)
        }

        const documents: Document[] | null | undefined = await uvcreferenceGetOnParam(req, size, "size")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference, msg: find error")
        }

        const results : UVC[] = await uvcReferenceGetPriceDocument(documents);


        res.status(OK).json(results);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})





export default router;