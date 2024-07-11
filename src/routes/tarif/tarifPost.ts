import express, { Request, Response } from "express"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { TARIF } from "./shared";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import TarifModel, { Tarif } from "../../schemas/tarifSchema";

const router = express.Router();

router.post(TARIF, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
       const object = req.body;

       if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }

        const newObject: Tarif | null | undefined = new TarifModel({...object});

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: newObject save did not work for some reason: " + newObject);
        }

        const savedObject: Tarif | null | undefined = await newObject.save({timestamps: true});

        res.status(OK).json(savedObject);
        

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;