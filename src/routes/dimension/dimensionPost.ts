import express, { Request, Response } from "express";
import { DIMENSION } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import DimensionModel, { Dimension } from "../../schemas/dimensionSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { getFormattedDate } from "../../services/formatDate";
import { exportToCSV } from "../../services/csvExportUtil";

const router = express.Router();

router.post(
  DIMENSION,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const object = req.body;

      if (!object) {
        throw new Error(
          req.originalUrl + ", msg: dimension was falsy: " + object
        );
      }

      const { code } = object;

      const doesExist: Document | null | undefined =
        await DimensionModel.findOne({ code });

      if (doesExist)
        throw new Error(
          "Une collection avec le code suivant existe déjà: " + code
        );

      const newObject: Dimension | null | undefined = await new DimensionModel({
        ...object,
      });

      if (!newObject) {
        throw new Error(
          req.originalUrl +
            " msg: dimension save did not work for some reason: " +
            object
        );
      }

      let csvFilePath;
      const result: Dimension | null | undefined = await newObject.save({
        timestamps: true,
      });

      if (result) {
        // Only execute CSV export if save was successful
        // Générer le nom du fichier exporté
      const formattedDate = getFormattedDate();
      const fileName = `PREREF_Y2_DIM_${formattedDate}.csv`;
      const fieldsToExport = ["type", "code", "label", "status"];

        // Exportation CSV avec tous les champs du document
        csvFilePath = await exportToCSV(
          result?.toObject(),
          fileName,
          fieldsToExport
        );

        res.status(OK).json({
          result,
          csvFilePath,
          msg: "Dimension created successfully",
        });
      } else {
        throw new Error("Failed to save the object");
      }
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

export default router;
