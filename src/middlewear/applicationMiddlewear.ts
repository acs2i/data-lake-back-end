import {Request, Response, NextFunction } from "express"
import { Hash } from "../utilities/authentification";
import { MongoClient } from "mongodb";
const path = "/authentification/application"
const uri = process.env.REMOTE_DEV_DB_URI as string
const DB = process.env.DATABASE as string
const targetCollection = "Applications" 

export const applicationAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    const { key}: {key: string} = await req.body;

    const hash : Error | string = await Hash(key);

    console.log("HASH: " , hash)

    if( hash instanceof Error) throw new Error(path + "/login")

    const client = new MongoClient(uri);

    const database = client.db(DB);

    const collection = database.collection(targetCollection);

    const document = await collection.findOne({key:hash});


    if(document) {
        next();

    } else {
        res.send({ message: "Document not found" })
    }
    await client.close()

    console.log("client is closed!")

}


export default applicationAuthorization;