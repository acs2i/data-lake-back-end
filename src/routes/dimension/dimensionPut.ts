import express, { Request, Response } from "express";
import { DIMENSION } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import DimensionModel from "../../schemas/dimensionSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.put(
  DIMENSION + "/:id",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const object = req.body;

      if (!object) {
        throw new Error(
          req.originalUrl + ", msg: dimension was falsy: " + object
        );
      }

      const _id: string | undefined | null = req.params.id;

      if (!_id) {
        throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id);
      }

      const response: UpdateWriteOpResult = await DimensionModel.updateOne(
        { _id },
        { $set: object }
      );

      if (
        response.acknowledged === true &&
        response.matchedCount === 1 &&
        response.modifiedCount === 1
      ) {
        // Définir les champs spécifiques à exporter
        const fieldsToExport = ["type", "code", "label", "status"];
        const formattedDate = getFormattedDate();

        // Appel à la fonction d'export CSV avec les champs sélectionnés
        const csvFilePath = await exportToCSV(
          object,
          `PREREF_Y2_DIM_${formattedDate}`,
          fieldsToExport
        );
        res.status(OK).json({
          msg: "Dimension updated successfully",
          csvFilePath,
        });
      } else {
        throw new Error(
          req.originalUrl +
            ", msg: There was a response that didn't match the needed criteria: " +
            response.acknowledged +
            " " +
            response.matchedCount +
            " " +
            response.modifiedCount
        );
      }
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json({});
    }
  }
);

export default router;
