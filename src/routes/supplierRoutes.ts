import express, { Request, Response } from "express";
import dotenv from "dotenv"
import authorizationMiddlewear from "../middlewears/applicationMiddlewear";
import { Document } from "mongodb";
import { OK } from "../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../codes/errors";
import SupplierModel from "../schemas/supplierSchema";
import { supplierreferenceGetOnParam } from "../services/supplierServices";
import { supplierPatchOnParam } from "../services/supplierServices";
import { UpdateWriteOpResult } from "mongoose";
import PriceModel from "../schemas/priceSchema";
dotenv.config();

const router = express.Router();
const path = "/supplier"
///////////////////////////////////////////////////////////////////////////////
// GET
///////////////////////////////////////////////////////////////////////////////

router.get(path, authorizationMiddlewear, async (req: Request, res: Response) => {
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


        const documents: Document[] | null | undefined = await SupplierModel.find().skip(skip).limit(intLimit);

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

router.get(path + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(path + "/reference/id/:id, msg: id was: " + id)
        }

        const document: Document | null | undefined = await SupplierModel.findById(id);


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


router.get(path + "/name/:name", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

     
        const name: string | undefined | null = req.params.name;

        if(name === null || name === undefined) {
            throw new Error(path + "/name/:name, msg: name was: " + name)
        }

        const documents: Document[] | null | undefined = await supplierreferenceGetOnParam(req, name, "name")

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


router.get(path + "/k/:k", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

     
        const k: string | undefined | null = req.params.k;

        if(k === null || k === undefined) {
            throw new Error(path + "/k/:k, msg: k was: " + k)
        }

        const documents: Document[] | null | undefined = await supplierreferenceGetOnParam(req, k, "k")

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

router.get(path + "/v/:v", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

     
        const v: string | undefined | null = req.params.v;

        if(v === null || v === undefined) {
            throw new Error(path + "/v/:v, msg: v was: " + v)
        }

        const documents: Document[] | null | undefined = await supplierreferenceGetOnParam(req, v, "v")

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

router.get(path + "/address/:address", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

     
        const address: string | undefined | null = req.params.address;

        if(address === null || address === undefined) {
            throw new Error(path + "/address/:address, msg: address was: " + address)
        }

        const documents: Document[] | null | undefined = await supplierreferenceGetOnParam(req, address, "address")

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


///////////////////////////////////////////////////////////////////////////////////////////////////////
// POST
///////////////////////////////////////////////////////////////////////////////////////////////////////
router.post(path, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {
        const newDocument = new SupplierModel({ ...req.body });

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

router.patch(path + "/name/:id", authorizationMiddlewear, async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/name/:id, msg: id was: " + id)
        }

        const name: string | undefined | null = req.body.name;

        if(name === null || name === undefined) {
            throw new Error(path + "/reference/name/:id, msg: name was: " + name)
        }

        const response: UpdateWriteOpResult = await supplierPatchOnParam("_id", id, "name", name);

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/name/:id, msg: issue with writing operation. Id was : " + id + " and name was : " + name)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})


router.patch(path + "/k/:id", authorizationMiddlewear, async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/name/:id, msg: id was: " + id)
        }

        const k: string | undefined | null = req.body.k;

        if(k === null || k === undefined) {
            throw new Error(path + "/reference/k/:id, msg: k was: " + k)
        }

        const response: UpdateWriteOpResult = await supplierPatchOnParam("_id", id, "k", k);

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

router.patch(path + "/v/:id", authorizationMiddlewear, async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/name/:id, msg: id was: " + id)
        }

        const v: string | undefined | null = req.body.v;

        if(v === null || v === undefined) {
            throw new Error(path + "/reference/v/:id, msg: v was: " + v)
        }

        const response: UpdateWriteOpResult = await supplierPatchOnParam("_id", id, "v", v);

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

router.patch(path + "/address/:id", authorizationMiddlewear, async (req: Request, res: Response) => {

    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/name/:id, msg: id was: " + id)
        }

        const address: string | undefined | null = req.body.address;

        if(address === null || address === undefined) {
            throw new Error(path + "/reference/address/:id, msg: address was: " + address)
        }

        const response: UpdateWriteOpResult = await supplierPatchOnParam("_id", id, "address", address);

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({})
        } else {
            throw new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + id + " and address was : " + address)
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

///////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE
///////////////////////////////////////////////////////////////////////////////////////////////////////
router.delete(path + "/:id", authorizationMiddlewear, async(req: Request, res: Response) => {
    

    try {
            
        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/reference/k/:id, msg: id was: " + id)
        }

        const response = await SupplierModel.deleteOne({ _id: id});

        if(response.acknowledged === true && response.deletedCount === 1 ) {
            res.status(OK).send(response);
        } else {
            throw new Error(req.originalUrl + ", msg: delete did not work for some reason with this id: " + id )
        }
    
    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }




})


export default router;