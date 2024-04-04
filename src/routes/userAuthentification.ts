import express, { Request, Response } from "express";
import dotenv from "dotenv"
import {Collection, Db, Document, InsertOneResult, MongoClient, WithId } from "mongodb"
import { BAD_REQUEST, NOT_FOUND } from "../codes/errors";
import { CREATED, OK } from "../codes/success";
import { Hash } from "../utilities/authentification";
import jwt from "jsonwebtoken"

dotenv.config()
const uri = process.env.REMOTE_DEV_DB_URI as string
const DB = process.env.DATABASE as string

const router = express.Router();
const path = "/authentification/user"
const targetCollection = "Users" 

// Sign up
router.post(path + "/signup", async (req : Request, res: Response) => {

    try {

        const { email, password }: {email: string, password: string} = await req.body;
        const hash : Error | string = await Hash(password);

        if( hash instanceof Error) {
            throw new Error(path + "/signup")
        }

        const client : MongoClient = new MongoClient(uri);

        const database : Db = client.db(DB);

        const collection: Collection<Document> | null = database.collection(targetCollection);

        // make sure user does not already exist
        const document : WithId<Document> | null = await collection.findOne({email, hash});

        if(document) {
            res.status(BAD_REQUEST).send({ message: "User already exists"})
            return;
        }

        const result: InsertOneResult = await collection.insertOne({email, hash});

        if(result.acknowledged === true) {
            res.status(CREATED).send({id: result.insertedId})


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
        const { email, password }: {email: string, password: string} = await req.body;

        const hash : Error | string = await Hash(password);

        if( hash instanceof Error) {
            throw new Error(path + "/signup")
        }
        
        const client : MongoClient = new MongoClient(uri);

        const database : Db = client.db(DB);

        const collection : Collection<Document> = database.collection(targetCollection);

        const document : WithId<Document> | null= await collection.findOne({email, hash});

        if(document) {
            const secret: string | null | undefined = process.env.JWT_SECRET;
            if(!(typeof secret === 'string')) {
                throw new Error(path + "/signup, problem with JWT_SECRET")
            }
            const token : string = jwt.sign({ email, hashedPassword: hash }, secret, { expiresIn: "18h" })
            
            res.status(OK).send({ message: "Document found" , token})

        } else {
            res.status(NOT_FOUND).send({ message: "Document not found" })
        }
        await client.close()

    }
    catch(err) {
        console.error(err);
        res.json(BAD_REQUEST)

    }

})

export default router;