import {Request, Response, NextFunction } from "express"
import { Hash } from "../services/authentificationServices";
import { Document } from "mongodb";
import {  UNAUTHORIZED } from "../codes/errors";
import jwt from "jsonwebtoken"
import AccessModel from "../schemas/accessSchema";

const path = "/authentification/application"


export const decryptUserToken = async ( authHeader: string ) : Promise<Error | boolean> => {
    
    try {
        const key : string  = authHeader.split(' ')[1]; // Assuming the format is "Bearer <key>"
    
        if (key === '') {
            // If key is missing, send a 400 Bad Request response
            return new Error('Invalid Authorization header format');
        }

    
        const secretKey : string | undefined | null = process.env.JWT_SECRET as string;
    
    
        if(!(typeof secretKey === 'string')) {
            return new Error(path + " DECRYPT TOKEN, problem with JWT_SECRET")
        }

    
        // jwt.verify(key, secretKey, (err, decoded) => {
        //     if(err)  return new Error('Unable to parse your Token');
        //     return true;
        // });

        const result =  jwt.verify(key, secretKey)

        if(result) return true;
        else return false;

    } catch(err) {
        console.warn("Error decrypting user token: " , err)
        return false;
    }
    
}


export const authorizationMiddlewear = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const authHeader : string | undefined = req.headers.authorization;

        
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // If it is a user using the admin application/interface
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        if (authHeader !== undefined) {
            // If Authorization header is missing, send a 401 Unauthorized response
            const result: boolean | Error = await decryptUserToken(authHeader);
            
            if(result === true) {
                next();
            } else {
                throw result;
            }
            return;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        // If it is an application
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        const key : string | string[] | undefined | null = req.headers['app-id']; // Replace 'header-name' with the name of the header you want to access


        if(key === undefined || key === null) {
            throw new Error(path + "/, didn't receive App-Id in application authorization middlewear")
        }

        const hashedKey : Error | string = await Hash(key as string);
        
        if( hashedKey instanceof Error) {
            throw new Error(path + ", msg: Hash problem in application authorization middlewear")
        }
    
        const document : Document | null | undefined = await AccessModel.findOne({ CLE_CHIFFRE: hashedKey})

        if ( document === null ||  document === undefined) {
            throw new Error(path + "/, msg: findOne error in application authorization middlewear")
        }

        next();

    }
    catch(err) {
        
        console.error(err);
        res.status(UNAUTHORIZED).json({})
    }



}


export default authorizationMiddlewear;