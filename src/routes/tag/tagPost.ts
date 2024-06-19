import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { TAG } from "./shared";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import TagModel, { Tag } from "../../schemas/tagSchema";

const router = express.Router();

router.post(TAG, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
       const object = req.body;

       if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }

        const newObject: Tag | null | undefined = new TagModel({...object});

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: newObject save did not work for some reason: " + newObject);
        }

        const savedObject: Tag | null | undefined = await newObject.save({timestamps: true});

        res.status(OK).json(savedObject);
        

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;