import express, { Request, Response } from "express"
import { EVENT } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import EventModel, { Event } from "../../schemas/eventSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();


router.post(EVENT, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const object = req.body;
        
        if(!object) {
            throw new Error(req.originalUrl + ", msg: Event was falsy: " + object)
        }

        const newObject: Event | null | undefined = await new EventModel({...object});

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: Event save did not work for some reason: " + object);
        }

        const result: Event | null | undefined = await newObject.save({timestamps: true});

        res.status(OK).json(result)

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;