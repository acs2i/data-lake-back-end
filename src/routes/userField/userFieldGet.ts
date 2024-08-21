import express, { Request, Response } from "express";
import UserFieldModel, {Field} from "../../schemas/userFieldSchema";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { USERFIELD } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";
import { ObjectId, Types } from "mongoose";

const { ObjectId } = Types;
const router = express.Router();

router.get(
  USERFIELD,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const { skip, intLimit } = await generalLimits(req);

      const data: Field[] | null | undefined = await UserFieldModel.find()
        .skip(skip)
        .limit(intLimit)
 
      if (data === null || data === undefined) {
        throw new Error(req.originalUrl + ", msg: find error");
      }

      const total = await UserFieldModel.countDocuments({});

      res.status(OK).json({ data, total });
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

// router.get(
//   USERFIELD + "/:id",
//   authorizationMiddlewear,
//   async (req: Request, res: Response) => {
//     try {
//       const id: string | undefined | null = req.params.id;

//       if (id === null || id === undefined) {
//         res.status(BAD_REQUEST).json({});
//         throw new Error(req.originalUrl + ", msg: id was: " + id);
//       }

//       const data: Product | null | undefined = await ProductModel.findById(id)
   

//       if (data === null || data === undefined) {
//         throw new Error(req.originalUrl + ", msg: find error");
//       }

//       res.status(OK).json(data);
//     } catch (err) {
//       res.status(BAD_REQUEST).json(err);
//       console.error(err);
//     }
//   }
// );

export default router;

