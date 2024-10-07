import express, { Request, Response } from "express";
import UnitModel, {Unit} from "../../schemas/unitSchema";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { UNIT } from "../unit/shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";


const router = express.Router();



router.get(
  UNIT,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
    
      const data: Unit[] | null | undefined = await UnitModel.find()

      if (data === null || data === undefined) {
        throw new Error(req.originalUrl + ", msg: find error");
      }

      res.status(OK).json({ data});
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  }
);


export default router;

