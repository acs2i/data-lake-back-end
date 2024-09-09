import express, { Request, Response } from 'express';
import { UVC } from './shared';
import { INTERNAL_SERVER_ERROR } from '../../codes/errors';
// import FamilyModel from '../../schemas/familySchema';
import { Document } from 'mongoose';
import { OK } from '../../codes/success';
import authorizationMiddlewear from '../../middlewears/applicationMiddlewear';
import UvcModel from '../../schemas/uvcSchema';

const router = express.Router();

router.post(UVC, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const object = req.body;
        console.log(req.body);
        if (!object) {
            throw new Error(req.originalUrl + ", msg: uvc was falsy: " + object);
        }

        const newObject: Document | null | undefined = await new UvcModel({ ...object });

        if (!newObject) {
            throw new Error(req.originalUrl + " msg: family save did not work for some reason: " + object);
        }

        const savedUvc: Document | null | undefined = await newObject.save({ timestamps: true });

        const _id = savedUvc._id;

        const result = { ...object, _id };

        res.status(OK).json(result);
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err);
    }
});

export default router;
