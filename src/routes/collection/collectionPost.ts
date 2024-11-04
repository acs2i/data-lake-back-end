import express, { Request, Response } from "express";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { COLLECTION } from "./shared";
import CollectionModel from "../../schemas/collectionSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { getFormattedDate } from "../../services/formatDate";
import { exportToCSV } from "../../services/csvExportUtil";

const router = express.Router();

router.post(
  COLLECTION,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const object = req.body;

      if (!object) {
        throw new Error(
          req.originalUrl + ", msg: collection was falsy: " + object
        );
      }

      // Check to see if the code already exists and if so through an error

      const { code } = object;

      const doesExist: Document | null | undefined =
        await CollectionModel.findOne({ code });

      if (doesExist)
        throw new Error(
          "Une collection avec le code suivant existe déjà: " + code
        );

      const newObject: Document | null | undefined = new CollectionModel({
        ...object,
      });

      if (!newObject) {
        throw new Error(
          req.originalUrl +
            " msg: collection save did not work for some reason: " +
            object
        );
      }

      const savedCollection: Document | null | undefined = await newObject.save(
        { timestamps: true }
      );

      // Générer le nom du fichier exporté
      const formattedDate = getFormattedDate();
      const fileName = `PREREF_Y2_COL_${formattedDate}.csv`;
      const fieldsToExport = ["code", "label", "status"];

      // Exportation CSV avec tous les champs du document
      const csvFilePath = await exportToCSV(
        savedCollection?.toObject(),
        fileName,
        fieldsToExport
      );

      res.status(OK).json({
        savedCollection,
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
