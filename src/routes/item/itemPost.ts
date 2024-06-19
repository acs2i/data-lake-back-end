import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";
import { ITEM } from "./shared";
import { OK } from "../../codes/success";
import ItemModel, { Item } from "../../schemas/itemSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";

const router = express.Router();

router.post(ITEM, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const object = req.body;
        
        if(!object) {
            throw new Error(req.originalUrl + ", msg: item was falsy: " + object)
        }

        const newObject: Item | null | undefined = new ItemModel({...object})
        
        if(!newObject) {
            throw new Error(req.originalUrl + " msg: item save did not work for some reason: " + newObject);
        }

        const data: Item | null | undefined = await newObject.save({timestamps: true});

        res.status(OK).json(data)

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;