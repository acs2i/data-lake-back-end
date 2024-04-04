import {Request, Response, NextFunction } from "express"
import { Hash } from "../utilities/authentification";
import { Collection, Db, Document, MongoClient, WithId } from "mongodb";
import { BAD_REQUEST, UNAUTHORIZED } from "../codes/errors";
const path = "/authentification/application"
const uri = process.env.REMOTE_DEV_DB_URI as string
const DB = process.env.DATABASE as string
const targetCollection = "Applications" 

export const applicationAuthorization = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { key }: {key: string} = await req.body;

        const client = new MongoClient(uri);

        const hash : Error | string = await Hash(key);
        
        if( hash instanceof Error) {
            await client.close()
            throw new Error(path + "/login")
        }
    
    
        const database : Db = client.db(DB);
    
        const collection : Collection<Document> = database.collection(targetCollection);
    
        const document : WithId<Document> | null = await collection.findOne({key:hash});
    
    
        if(document) {
            next();
    
        } else {
            res.send(UNAUTHORIZED)
        }
        await client.close()
    }
    catch(err) {
        
        console.error(err);
        res.send(BAD_REQUEST)
    }



}


export default applicationAuthorization;