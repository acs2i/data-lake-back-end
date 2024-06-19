import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { TAG_GROUPING } from "./shared";
import { OK } from "../../codes/success";
import TagGroupingModel, { TagGrouping } from "../../schemas/tagGroupingSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";

const router = express.Router();

router.post(TAG_GROUPING, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
       const object = req.body;

       if(!object) {
            throw new Error(req.originalUrl + ", msg: tag grouping was falsy: " + object)
        }

        const newObject: TagGrouping | null | undefined = new TagGroupingModel({...object});

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: tag grouping save did not work for some reason: " + newObject);
        }

        const savedObject: TagGrouping | null | undefined = await newObject.save({timestamps: true});

        res.status(OK).json(savedObject);
        

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;