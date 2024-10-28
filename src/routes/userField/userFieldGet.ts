import express, { Request, Response } from "express";
import UserFieldModel, { Field } from "../../schemas/userFieldSchema";
import { Document } from "mongoose";
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
        .sort({ createdAt: -1 })
        .skip(skip)
  

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

router.get(USERFIELD + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
  try {

      const {intLimit, skip} = await generalLimits(req);


      let filter: any = { $and: [] }  // any to make typescript stop complaining

      const code = req.query.code;

      if(code) {
          // const regEx = new RegExp(code as number, "i");
          filter.$and.push({ code })
      }
      
      const label = req.query.label;

      if(label) {
          const regEx = new RegExp(label as string, "i");
          filter.$and.push({ label: regEx })
      }

      const status = req.query.status;

      if(status) {
          // const regEx = new RegExp(status as string, "i");
          filter.$and.push({ status })
      }
      
      if(!code && !label && !status) {
          throw new Error(req.originalUrl + ", msg: All of the parameters were falsy. Probably means they were undefined")
      }


      // both the yx code and yx libelle can be very similar, so we should just do an or and a regex in both fields
      const data: Document[] | null | undefined = await UserFieldModel.find(filter).skip(skip).limit(intLimit);


      if (!data) {
          throw new Error(req.originalUrl + ", msg: find error")
      }

      const total = await UserFieldModel.countDocuments(filter);

      res.status(OK).json({data, total})

  } catch(err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err)
  }

})

router.get(
  USERFIELD + "/:id",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const id: string | undefined | null = req.params.id;

      if (id === null || id === undefined) {
        res.status(BAD_REQUEST).json({});
        throw new Error(req.originalUrl + ", msg: id was: " + id);
      }

      const data: Field | null | undefined = await UserFieldModel.findById(id);

      if (data === null || data === undefined) {
        throw new Error(req.originalUrl + ", msg: find error");
      }

      res.status(OK).json(data);
    } catch (err) {
      res.status(BAD_REQUEST).json(err);
      console.error(err);
    }
  }
);

export default router;
