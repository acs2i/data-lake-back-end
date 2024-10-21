import express, { Request, Response } from "express"
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { COLLECTION } from "./shared";
import CollectionModel from "../../schemas/collectionSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();


router.post(COLLECTION, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        
        const object = req.body;

        if(!object) {
            throw new Error(req.originalUrl + ", msg: collection was falsy: " + object)
        }

        // Check to see if the code already exists and if so through an error

        const {code} = object;
        
        const doesExist : Document | null | undefined = await CollectionModel.findOne({ code });

        if(doesExist) throw new Error("Une collection avec le code suivant existe déjà: " + code);

        const newObject: Document | null | undefined = new CollectionModel({...object });

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: collection save did not work for some reason: " + object);
        }

        const savedCollection: Document | null | undefined = await newObject.save({timestamps: true});

        res.status(OK).json(savedCollection);
        
    }
    catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }



})

export default router;