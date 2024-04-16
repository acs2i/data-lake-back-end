import express, { Request, Response } from "express";
import dotenv from "dotenv"
import authorizationMiddlewear from "../middlewears/applicationMiddlewear";
import { Document } from "mongodb";
import { OK } from "../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../codes/errors";
import PriceModel, { Price } from "../schemas/priceSchema";
import { Model, UpdateWriteOpResult } from "mongoose";

dotenv.config();

const router = express.Router();
const path = "/price"

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


        const documents: Document[] | null | undefined = await PriceModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(path + "/price, msg: find error")
        }


        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.error(err)
    }

})

router.get(path + "/:id",  async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(path + "/price/id/:id, msg: id was: " + id)
        }

        const document: Document | null | undefined = await PriceModel.findById(id);


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


router.post(path,  async ( req: Request, res: Response) => {
    try {
        const price: string | undefined | null = req.body.price;

        
        if(price === null || price === undefined) {
            throw new Error(path + "/price, msg: post - price was: " + price)
        }

        const newDocument = new PriceModel({ price });

        const response   = await newDocument.save({ timestamps: true});

        if(response) {
            res.status(OK).send(response);
        } else {
            throw new Error(path + "/price, msg: save did not work for some reason : " + price )
        }

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }
})

router.patch(path + "/:id",  async (req: Request, res: Response) => {
    try {
        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/price/id/:id, msg: id was: " + id)
        }

        const price: string | undefined | null = req.body.price;

        if(price === null || price === undefined) {
            throw new Error(path + "/price/price/:id, msg: price was: " + price)
        }

        const response : UpdateWriteOpResult = await PriceModel.updateOne({ _id: id}, { $set: { price }});

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).send({})
        } else {
            throw new Error(path + "/price/:id, msg: patch price value : " + id )
        }

    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }
})

router.delete(path + "/:id" ,  async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(path + "/price/id/:id, msg: id was: " + id)
        }

        const response = await PriceModel.findByIdAndDelete(id);
        
        if(response) {
            res.status(OK).send(response);
        } else {
            throw new Error(path + "/price, msg: delete did not work for some reason : " + id )
        }


    } catch(err) {
        res.status(BAD_REQUEST).send({})
        console.error(err)
    }

})

export default router;