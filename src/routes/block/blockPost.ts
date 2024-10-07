import express, { Request, Response } from "express";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { BLOCK } from "../block/shared"
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import BlockModel, {Block} from "../../schemas/blockSchema"

const router = express.Router();

router.post(
  BLOCK,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const object = req.body;

      if (!object) {
        throw new Error(req.originalUrl + ", msg: object was falsy: " + object);
      }

      // Récupérer le dernier objet trié par `code` pour auto-incrémentation
      const lastBlock = await BlockModel.findOne().sort({ code: -1 });

      // Incrémenter le code de 1
      const newCode = lastBlock ? lastBlock.code + 1 : 1;

      // Créer la nouvelle taxe avec le code auto-incrémenté
      const newObject: Block | null | undefined = new BlockModel({
        ...object,
        code: newCode,
      });

      if (!newObject) {
        throw new Error(
          req.originalUrl +
            " msg: newObject save did not work for some reason: " +
            newObject
        );
      }

      const savedObject: Block | null | undefined = await newObject.save({
        timestamps: true,
      });

      res.status(OK).json(savedObject);
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

export default router;
