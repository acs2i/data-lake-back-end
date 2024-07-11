import express, { Request, Response } from 'express'
import { CLIENT } from './shared';
import { INTERNAL_SERVER_ERROR } from '../../codes/errors';
import ClientModel from '../../schemas/clientSchema';
import { Document } from 'mongoose';
import { OK } from '../../codes/success';
import authorizationMiddlewear from '../../middlewears/applicationMiddlewear';


const router = express.Router();


router.post(CLIENT, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const object = req.body;

        if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }

        const newObject: Document | null | undefined = await new ClientModel({...object});

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: object save did not work for some reason: " + object);
        }

        const savedObject: Document | null | undefined = await newObject.save({timestamps: true});

        res.status(OK).json(savedObject)

    } catch(err) {
        console.error(err);
        res.send(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;