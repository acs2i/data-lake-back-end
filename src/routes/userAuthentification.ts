import express, { Request, Response } from "express";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import {InsertOneResult, MongoClient } from "mongodb"
import { BAD_REQUEST, NOT_FOUND } from "../codes/errors";
import { CREATED, OK } from "../codes/success";
dotenv.config()

const router = express.Router();
const path = "/authentification"
const saltRounds = process.env.SALT as string;
const uri = "mongodb://192.168.10.235:27017"
const DB = "dev" 
const COLLECTION = "Users" 

// Sign up
router.post(path + "/signup", async (req : Request, res: Response) => {

    try {

        const { user, password }: {user: string, password: string} = await req.body;

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            // Store hash in your password DB.
            if(err) throw new Error(path + "/signup")

            console.log("Hash : ", hash);

            const client = new MongoClient(uri);

            const database = client.db(DB);

            const collection = database.collection(COLLECTION);

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


        });
    } 
    catch(err) {
        console.error(err)
        res.json(BAD_REQUEST)
    }
});
  

router.post(path + "/login" , async (req: Request, res: Response) => {
    try {
        const { user, password }: {user: string, password: string} = await req.body;

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            // Store hash in your password DB.
            if(err) throw new Error(path + "/login")
            
            const client = new MongoClient(uri);

            const database = client.db(DB);

            const collection = database.collection(COLLECTION);

            const document = await collection.findOne({user, hash});

            if(document) {
                res.status(OK).send({ message: "Document found" , document})

            } else {
                res.status(NOT_FOUND).send({ message: "Document not found" })
            }
            // store in the data base 
        });
    }
    catch(err) {
        console.log(err);
        res.json(BAD_REQUEST)

    }

})

export default router;