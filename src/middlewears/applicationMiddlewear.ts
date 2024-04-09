import {Request, Response, NextFunction } from "express"
import { Hash } from "../utilities/authentificationUtilities";
import { Document } from "mongodb";
import { UNAUTHORIZED } from "../codes/errors";
import AuthorizationModel from "../schemas/applicationSchema"

const path = "/authentification/application"


export const applicationAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const key : string | string[] | undefined | null = req.headers['app-id']; // Replace 'header-name' with the name of the header you want to access

        if(key === undefined || key === null) {
            throw new Error(path + "/, didn't receive App-Id in application authorization middlewear")
        }

        const hashedKey : Error | string = await Hash(key as string);
        
        if( hashedKey instanceof Error) {
            throw new Error(path + ", msg: Hash problem in application authorization middlewear")
        }
    

        const document : Document | null | undefined = await AuthorizationModel.findOne({ hashedKey: hashedKey})

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