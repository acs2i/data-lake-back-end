import express, { Request, Response } from "express";
import { TAG } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import TagModel from "../../schemas/tagSchema";
import { OK } from "../../codes/success";
import { UpdateWriteOpResult } from "mongoose";
import { exportToCSV } from "../../services/csvExportUtil";

const router = express.Router();

router.put(TAG + "/:id", async (req: Request, res: Response) => {
  try {
    const object = req.body;

    if (!object) {
      throw new Error(req.originalUrl + ", msg: tag was falsy: " + object);
    }

    const _id = req.params.id;

    if (!_id) {
      throw new Error(req.originalUrl + ", msg: id was falsy: " + _id);
    }

    const response: UpdateWriteOpResult = await TagModel.updateOne(
      { _id },
      { $set: object }
    );

    if (
      response.acknowledged === true &&
      response.matchedCount === 1 &&
      response.modifiedCount === 1
    ) {
      // Définir les champs spécifiques à exporter
      const fieldsToExport = ["level", "code", "name", "status"];
      const now = new Date();
      const formattedDate =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        "_" +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0");
      // Appel à la fonction d'export CSV avec les champs sélectionnés
      const csvFilePath = await exportToCSV(
        object,
        `PREREF_Y2_CLASS_${formattedDate}`,
        fieldsToExport
      );

      res.status(OK).json({
        msg: "Tag updated successfully",
        csvFilePath, // Retourne le chemin du fichier CSV dans la réponse
      });
    } else {
      res.status(INTERNAL_SERVER_ERROR).json({ msg: "Tag was not updated" });
    }
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({});
  }
});

export default router;
