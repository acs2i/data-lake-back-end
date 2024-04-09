import express, { Request, Response } from "express";
import dotenv from "dotenv"
import applicationAuthorization from "../middlewears/applicationMiddlewear";
import { Document } from "mongodb";
import { OK } from "../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../codes/errors";
import { UVC } from "../interfaces/resultInterfaces";
import { uvcFetchPriceModel, uvcGetBasedOnParam } from "../utilities/uvcUtilities";
import UVCModel from "../schemas/uvcSchema";
import SupplierSchema from "../schemas/supplierSchema";
import { supplierGetBasedOnParam } from "../utilities/supplierUtilities";
dotenv.config();

const router = express.Router();
const path = "/supplier"

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


        const documents: Document[] | null | undefined = await SupplierSchema.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference, msg: find error")
        }


        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})

router.get(path + "/:id", applicationAuthorization, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(path + "/reference/id/:id, msg: id was: " + id)
        }

        const document: Document | null | undefined = await SupplierSchema.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            return;
        }

        res.status(OK).json(document)

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})


router.get(path + "/name/:name", applicationAuthorization, async (req: Request, res: Response) => {
    try {

     
        const name: string | undefined | null = req.params.name;

        if(name === null || name === undefined) {
            throw new Error(path + "/name/:name, msg: name was: " + name)
        }

        const documents: Document[] | null | undefined = await supplierGetBasedOnParam(req, name, "name")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference, msg: find error")
        }

        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})


router.get(path + "/k/:k", applicationAuthorization, async (req: Request, res: Response) => {
    try {

     
        const k: string | undefined | null = req.params.k;

        if(k === null || k === undefined) {
            throw new Error(path + "/k/:k, msg: k was: " + k)
        }

        const documents: Document[] | null | undefined = await supplierGetBasedOnParam(req, k, "k")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference, msg: find error")
        }

        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})

router.get(path + "/v/:v", applicationAuthorization, async (req: Request, res: Response) => {
    try {

     
        const v: string | undefined | null = req.params.v;

        if(v === null || v === undefined) {
            throw new Error(path + "/v/:v, msg: v was: " + v)
        }

        const documents: Document[] | null | undefined = await supplierGetBasedOnParam(req, v, "v")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference, msg: find error")
        }

        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})

router.get(path + "/address/:address", applicationAuthorization, async (req: Request, res: Response) => {
    try {

     
        const address: string | undefined | null = req.params.address;

        if(address === null || address === undefined) {
            throw new Error(path + "/address/:address, msg: address was: " + address)
        }

        const documents: Document[] | null | undefined = await supplierGetBasedOnParam(req, address, "address")

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/reference, msg: find error")
        }

        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})





export default router;