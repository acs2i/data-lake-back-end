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
        const uvc = req.body;

        if (!uvc) {
            throw new Error(req.originalUrl + ", msg: uvc was falsy: " + uvc);
        }

        const newUvc: Document | null | undefined = await new UvcModel({ ...uvc });

        if (!newUvc) {
            throw new Error(req.originalUrl + " msg: family save did not work for some reason: " + uvc);
        }

        const savedUvc: Document | null | undefined = await newUvc.save({ timestamps: true });

        const _id = savedUvc._id;

        const result = { ...uvc, _id };

        res.status(OK).json(result);
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err);
    }
});

export default router;
