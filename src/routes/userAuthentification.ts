import express, { Request, Response } from "express";
import dotenv from "dotenv"
import {InsertOneResult, MongoClient } from "mongodb"
import { BAD_REQUEST, NOT_FOUND } from "../codes/errors";
import { CREATED, OK } from "../codes/success";
import { Hash } from "../utilities/authentification";

dotenv.config()
const uri = process.env.REMOTE_DEV_DB_URI as string
const DB = process.env.DATABASE as string

const router = express.Router();
const path = "/authentification/user"
const targetCollection = "Users" 

// Sign up
router.post(path + "/signup", async (req : Request, res: Response) => {

    try {

        const { user, password }: {user: string, password: string} = await req.body;
        const hash : Error | string = await Hash(password);

        if( hash instanceof Error) {
            throw new Error(path + "/signup")
        }

        const client = new MongoClient(uri);

        const database = client.db(DB);

        const collection = database.collection(targetCollection);

        // make sure user does not already exist
        const document = await collection.findOne({user, hash});

        if(document) {
            res.status(BAD_REQUEST).send({ message: "User already exists"})
            return;
        }

        const result: InsertOneResult = await collection.insertOne({user, hash});

        if(result.acknowledged === true) {
            res.status(CREATED).send({})


        } else {
            res.status(BAD_REQUEST).send({message: "Problem with creation of user"})

        }
        await client.close()

    } 
    catch(err) {
        console.error(err)
        res.json(BAD_REQUEST)
    }
});
  

router.post(path + "/login" , async (req: Request, res: Response) => {
    try {
        const { user, password }: {user: string, password: string} = await req.body;

        const hash : Error | string = await Hash(password);

        if( hash instanceof Error) {
            throw new Error(path + "/signup")
        }
        
        const client = new MongoClient(uri);

        const database = client.db(DB);

        const collection = database.collection(targetCollection);

        const document = await collection.findOne({user, hash});

        if(document) {
            res.status(OK).send({ message: "Document found" , document})

        } else {
            res.status(NOT_FOUND).send({ message: "Document not found" })
        }
        await client.close()

    }
    catch(err) {
        console.log(err);
        res.json(BAD_REQUEST)

    }

})

export default router;