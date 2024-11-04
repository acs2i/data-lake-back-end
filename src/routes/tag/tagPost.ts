import express, { Request, Response } from "express";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { TAG } from "./shared";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import TagModel, { Tag } from "../../schemas/tagSchema";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.post(
  TAG,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const object = req.body;

      if (!object) {
        throw new Error(req.originalUrl + ", msg: object was falsy: " + object);
      }

      const { code } = object;

      const doesExist: Document | null | undefined = await TagModel.findOne({
        code,
      });

      if (doesExist)
        throw new Error(
          "Une collection avec le code suivant existe déjà: " + code
        );

      const newObject: Tag | null | undefined = new TagModel({ ...object });

      if (!newObject) {
        throw new Error(
          req.originalUrl +
            " msg: newObject save did not work for some reason: " +
            newObject
        );
      }

      const savedObject: Tag | null | undefined = await newObject.save({
        timestamps: true,
      });

      // Générer le CSV après la sauvegarde
      const formattedDate = getFormattedDate();
      const fileName = `PREREF_Y2_CLASS_${formattedDate}.csv`;
      const fieldsToExport = ["level", "code", "name", "status"];

      // Exportation CSV avec tous les champs du document
      const csvFilePath = await exportToCSV(
        savedObject?.toObject(),
        fileName,
        fieldsToExport
      );

      res.status(OK).json({
        savedObject,
        csvFilePath,
        msg: "Tax created successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

export default router;
