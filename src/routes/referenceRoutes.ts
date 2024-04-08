import express, { Request, Response } from "express";
import dotenv from "dotenv"
import applicationAuthorization from "../middlewears/applicationMiddlewear";
import ReferenceModel from "../schemas/referenceSchema";
import { Document } from "mongodb";
import { OK } from "../codes/success";
import mongoose from "mongoose";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../codes/errors";
dotenv.config();



const router = express.Router();
const path = "/reference"

// Tested 
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

        res.status(OK).json({page, limit, total: documents.length, data: documents});

    }
    catch(err) {
        res.status(INTERNAL_SERVER_ERROR).send({})
        console.log(err)
    }

})


// tested
router.get(path + "/:id", applicationAuthorization, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(path + "/reference/:id, msg: id was: " + id)
        }

        const documents: Document[] | null | undefined = await ReferenceModel.findById(id);

        if ( documents === null ||  documents === undefined) {
            res.status(OK).json({});
        }

        res.status(OK).json(documents);

    }
    catch(err) {
        res.status(BAD_REQUEST).send({})
        console.log(err)
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


        // console.log("familyu: "  ,family)
        const documents: Document[] | null | undefined = await ReferenceModel.find({family}).skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            res.status(OK).json({});
        } else {
            res.status(OK).json(documents);

        }


    }
    catch(err) {
        res.status(BAD_REQUEST).json({})
        console.log(err)
    }

})




export default router;