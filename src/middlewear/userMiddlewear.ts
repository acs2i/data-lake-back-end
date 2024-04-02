import {Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { Hash } from "../utilities/authentification";
import { MongoClient } from "mongodb";
import { BAD_REQUEST } from "../codes/errors";
dotenv.config()

const path = "/authentification/application"
const uri = process.env.REMOTE_DEV_DB_URI as string
const DB = process.env.DATABASE as string
const targetCollection = "Users" 


export const decryptToken = async ( req: Request, res: Response, next :NextFunction) => {


    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // If Authorization header is missing, send a 401 Unauthorized response
        return res.status(BAD_REQUEST).send('Authorization header is missing');
    }

    const key = authHeader.split(' ')[1]; // Assuming the format is "Bearer <key>"
    console.log(key)

    if (!key) {
        // If key is missing or improperly formatted, send a 400 Bad Request response
        return res.status(BAD_REQUEST).send('Invalid Authorization header format');
    }

    const secretKey = process.env.JWT_SECRET as string;


    jwt.verify(key, secretKey, (err, decoded) => {
        if(err)  return res.status(BAD_REQUEST).send('Unable to parse your Token');

        console.log("decoded : " ,decoded)
        next();
    });
}