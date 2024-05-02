import express, { Request, Response } from 'express'
import { FAMILY } from './shared';
import { INTERNAL_SERVER_ERROR } from '../../codes/errors';
import FamilyModel from '../../schemas/familySchema';
import { Document, ObjectId, UpdateWriteOpResult } from 'mongoose';
import { OK } from '../../codes/success';
import authorizationMiddlewear from '../../middlewears/applicationMiddlewear';


const router = express.Router();


router.post(FAMILY, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const family = req.body;

        if(!family) {
            throw new Error(req.originalUrl + ", msg: family was falsy: " + family)
        }

        const newFamily: Document | null | undefined = await new FamilyModel({...family});

        if(!newFamily) {
            throw new Error(req.originalUrl + " msg: family save did not work for some reason: " + family);
        }

        const savedFamily: Document | null | undefined = await newFamily.save({timestamps: true});

        const _id  : string = savedFamily._id;



            const result = { ...family, _id};

            res.status(OK).json(result)




    } catch(err) {
        console.error(err);
        res.send(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;