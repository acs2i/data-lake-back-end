import express, { Request, Response } from "express";
import { DIMENSION } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import DimensionModel from "../../schemas/dimensionSchema";
import { OK } from "../../codes/success";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.put(DIMENSION + "/:id", async (req: Request, res: Response) => {
  try {
    const { updateEntry, ...object } = req.body;

    if (!object) {
      throw new Error(
        req.originalUrl +
          ", msg: dimension was falsy: " +
          JSON.stringify(object)
      );
    }

    const _id = req.params.id;

    if (!_id) {
      throw new Error(req.originalUrl + ", msg: id was falsy: " + _id);
    }

    // Récupérer le document pour mise à jour
    const dimension = await DimensionModel.findById(_id);
    if (!dimension) {
      return res.status(404).json({ msg: "Dimension not found" });
    }

    // Mettre à jour les champs modifiés
    Object.assign(dimension, object);

    // Générer le nom du fichier exporté
    // const formattedDate = getFormattedDate();
    // const fileName = `PREREF_Y2_DIM_${formattedDate}.csv`;
    // const fieldsToExport = ["type", "code", "label", "status"];

    // Exportation CSV avec tous les champs du document
    // const csvFilePath = await exportToCSV(
    //   dimension.toObject(), // Convertir le document Mongoose en objet
    //   fileName,
    //   fieldsToExport
    // );

    // Ajouter `updateEntry` dans le tableau `updates` avec `file_name`
    if (updateEntry) {
      dimension.updates.push({
        updated_at: updateEntry.updated_at,
        updated_by: updateEntry.updated_by,
        changes: updateEntry.changes,
        // file_name: fileName, // Ajout du nom du fichier dans l'entrée d'historique
      });
    }

    const result = await dimension.save();

    if (result) {
      // Générer le nom du fichier exporté
      const formattedDate = getFormattedDate();
      const fileName = `PREREF_Y2_DIM_${formattedDate}.csv`;
      const fieldsToExport = ["type", "code", "label", "status"];

      // Exportation CSV avec tous les champs du document
      const csvFilePath = await exportToCSV(
        dimension.toObject(), // Convertir le document Mongoose en objet
        fileName,
        fieldsToExport
      );

      res.status(OK).json({
        msg: "Dimension updated successfully",
        csvFilePath,
      });
    } else {
      throw new Error("Failed to save the object");
    }
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({});
  }
});

export default router;
