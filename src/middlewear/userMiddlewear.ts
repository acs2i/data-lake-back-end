import {Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../codes/errors";
dotenv.config()

const path = "/authentification/application"
const uri = process.env.REMOTE_DEV_DB_URI as string
const DB = process.env.DATABASE as string
const targetCollection = "Users" 


export const decryptToken = async ( req: Request, res: Response, next :NextFunction) => {

    try {
        const authHeader : string | undefined = req.headers.authorization;
        if (!authHeader) {
            // If Authorization header is missing, send a 401 Unauthorized response
            return res.status(BAD_REQUEST).send('Authorization header is missing');
        }
    
        const key : string  = authHeader.split(' ')[1]; // Assuming the format is "Bearer <key>"
    
        if (key === '') {
            // If key is missing, send a 400 Bad Request response
            return res.status(BAD_REQUEST).send('Invalid Authorization header format');
        }
    
        const secretKey : string | undefined | null = process.env.JWT_SECRET as string;
    
    
        if(!(typeof secretKey === 'string')) {
            throw new Error(path + "MIDDLEWEAR - DECRYPT TOKEN, problem with JWT_SECRET")
        }
    
        jwt.verify(key, secretKey, (err, decoded) => {
            if(err)  return res.status(BAD_REQUEST).send('Unable to parse your Token');
            next();
        });
    } catch(err) {
        console.error(err);
        res.send(INTERNAL_SERVER_ERROR)

    }

}