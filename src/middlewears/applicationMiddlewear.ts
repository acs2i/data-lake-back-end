import {Request, Response, NextFunction } from "express"
import { Hash } from "../utilities/authentification";
import { Document } from "mongodb";
import { UNAUTHORIZED } from "../codes/errors";
import AuthorizationModel from "../schemas/Application"

const path = "/authentification/application"


export const applicationAuthorization = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { key }: {key: string} = await req.body;

        const hashedKey : Error | string = await Hash(key);
        
        if( hashedKey instanceof Error) {
            throw new Error(path + ", msg: Hash problem in application authorization middlewear")
        }
    
        const document : Document | null | undefined = await AuthorizationModel.findOne({hashedKey})

        if ( document === null ||  document === undefined) {
            throw new Error(path + "/, msg: findOne error in application authorization middlewear")
        }

        next();

    }
    catch(err) {
        
        console.error(err);
        res.send(UNAUTHORIZED)
    }



}


export default applicationAuthorization;