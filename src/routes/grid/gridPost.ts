import express, { Request, Response } from 'express'
import {  GRID } from './shared';
import { INTERNAL_SERVER_ERROR } from '../../codes/errors';
import GridModel from '../../schemas/gridSchema';
import { Document } from 'mongoose';
import { OK } from '../../codes/success';
import authorizationMiddlewear from '../../middlewears/applicationMiddlewear';


const router = express.Router();


router.post(GRID, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const grid = req.body;

        if(!grid) {
            throw new Error(req.originalUrl + ", msg: grid was falsy: " + grid)
        }

        const newGrid: Document | null | undefined = await new GridModel({...grid});

        if(!newGrid) {
            throw new Error(req.originalUrl + " msg: grid save did not work for some reason: " + grid);
        }

        const result: Document | null | undefined = await newGrid.save({timestamps: true});

        res.status(OK).json(result)


    } catch(err) {
        console.error(err);
        res.send(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;