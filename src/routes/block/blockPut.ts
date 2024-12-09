import express, { Request, Response } from "express";
import { BLOCK } from "../block/shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import BlockModel from "../../schemas/blockSchema";
import { OK } from "../../codes/success";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.put(
  BLOCK + "/:id",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const { updateEntry, ...object } = req.body;

      if (!object) {
        throw new Error(
          req.originalUrl + ", msg: block was falsy: " + JSON.stringify(object)
        );
      }

      const _id = req.params.id;

      if (!_id) {
        throw new Error(req.originalUrl + ", msg: id was falsy: " + _id);
      }

      // Récupérer le document pour mise à jour
      const block = await BlockModel.findById(_id);
      if (!block) {
        return res.status(404).json({ msg: "Block not found" });
      }

      // Mettre à jour les champs modifiés
      Object.assign(block, object);

      // Générer le nom du fichier exporté
      const formattedDate = getFormattedDate();
      const fileName = `PREREF_Y2_BLOCK_${formattedDate}.csv`;
      const fieldsToExport = ["code", "label", "status"]; // Ajuster selon les champs de votre modèle Block

      // Ajouter `updateEntry` dans le tableau `updates` avec `file_name`
      if (updateEntry) {
        block.updates.push({
          updated_at: updateEntry.updated_at,
          updated_by: updateEntry.updated_by,
          changes: updateEntry.changes,
          file_name: fileName,
        });
      }

      const result = await block.save();

      if (result) {
        // Exportation CSV avec les champs sélectionnés
        const csvFilePath = await exportToCSV(
          block.toObject(),
          fileName,
          fieldsToExport
        );
        res.status(OK).json({
          msg: "Block updated successfully",
          csvFilePath,
        });
      } else {
        throw new Error("Failed to save the object");
      }
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json({});
    }
  }
);

export default router;
