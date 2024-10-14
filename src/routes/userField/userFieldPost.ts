import express, { Request, Response } from "express"
import UserFieldModel, {Field} from "../../schemas/userFieldSchema";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { USERFIELD } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();


router.post(USERFIELD, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        // expects brand 
        const object = req.body;

        if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }

           // Récupérer le dernier objet trié par `code` pour auto-incrémentation
      const lastField = await UserFieldModel.findOne().sort({ code: -1 });

      // Incrémenter le code de 1
      const newCode = lastField ? lastField.code + 1 : 1;

      // Créer la nouvelle taxe avec le code auto-incrémenté
      const newObject: Field | null | undefined = new UserFieldModel({
        ...object,
        code: newCode, // Utiliser le nouveau code
      });

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: brand save did not work for some reason: " + object);
        }

        const savedObject: Document | null | undefined = await newObject.save({timestamps: true});
        
        res.status(OK).json(savedObject);
        
    }
    catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }


})
export default router;