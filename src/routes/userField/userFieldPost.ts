import express, { Request, Response } from "express";
import UserFieldModel, { Field } from "../../schemas/userFieldSchema";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { USERFIELD } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { getFormattedDate } from "../../services/formatDate";
import { exportToCSV } from "../../services/csvExportUtil";

const router = express.Router();

router.post(
  USERFIELD,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      // expects brand
      const object = req.body;

      if (!object) {
        throw new Error(req.originalUrl + ", msg: object was falsy: " + object);
      }

      const lastField = await UserFieldModel.findOne().sort({ code: -1 });
      const newCode = lastField ? lastField.code + 1 : 1;

      // Créer la nouvelle taxe avec le code auto-incrémenté
      const newObject: Field | null | undefined = new UserFieldModel({
        ...object,
        code: newCode,
      });

      if (!newObject) {
        throw new Error(
          req.originalUrl +
            " msg: brand save did not work for some reason: " +
            object
        );
      }

      const savedObject: Document | null | undefined = await newObject.save({
        timestamps: true,
      });

      // Générer le CSV après la sauvegarde
      // const formattedDate = getFormattedDate();
      // const fileName = `PREREF_Y2_USERFIELD_${formattedDate}.csv`;
      // const fieldsToExport = ["code", "label", "status"];

      // Exportation CSV avec tous les champs du document
      // const csvFilePath = await exportToCSV(
      //   savedObject?.toObject(),
      //   fileName,
      //   fieldsToExport
      // );

      res.status(OK).json({
        savedObject,
        // csvFilePath,
        msg: "Tax created successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  }
);
export default router;
