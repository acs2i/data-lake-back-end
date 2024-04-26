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

        const updatedFamily: UpdateWriteOpResult = await savedFamily.updateOne({$set: { YX_CODE: _id }})       // This is the new method going forward to ensure uniqueness!

        if (updatedFamily.acknowledged === true && updatedFamily.matchedCount === 1 && updatedFamily.modifiedCount === 1) {

            const result = { ...family, _id, YX_CODE: _id };

            res.status(OK).json(result)

        } else {
            // Undo post completely
            FamilyModel.deleteOne({ _id});

            throw new Error(req.originalUrl + ", msg: for some reason, yx code could not be updated with id of the saved family");
        }



    } catch(err) {
        console.error(err);
        res.send(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;