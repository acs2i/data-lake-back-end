import express, { Request, Response } from "express";
import { TAG } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import TagModel from "../../schemas/tagSchema";
import { OK } from "../../codes/success";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.put(TAG + "/:id", async (req: Request, res: Response) => {
  try {
    const { updateEntry, ...object } = req.body;

    if (!object) {
      throw new Error(
        req.originalUrl + ", msg: tag was falsy: " + JSON.stringify(object)
      );
    }

    const _id = req.params.id;

    if (!_id) {
      throw new Error(req.originalUrl + ", msg: id was falsy: " + _id);
    }

    // Récupérer le document pour mise à jour
    const tag = await TagModel.findById(_id);
    if (!tag) {
      return res.status(404).json({ msg: "Tag not found" });
    }

    // Mettre à jour les champs modifiés
    Object.assign(tag, object);

    // Générer le nom du fichier exporté
    const formattedDate = getFormattedDate();
    const fileName = `PREREF_Y2_CLASS_${formattedDate}.csv`;
    const fieldsToExport = ["level", "code", "name", "status"];

    // Exportation CSV avec tous les champs du document
    const csvFilePath = await exportToCSV(
      tag.toObject(), // Convertir le document Mongoose en objet
      fileName,
      fieldsToExport
    );

    // Ajouter `updateEntry` dans le tableau `updates` avec `file_name`
    if (updateEntry) {
      tag.updates.push({
        updated_at: updateEntry.updated_at,
        updated_by: updateEntry.updated_by,
        changes: updateEntry.changes,
        file_name: fileName, // Ajout du nom du fichier dans l'entrée d'historique
      });
    }

    // Sauvegarder les modifications et l'historique
    await tag.save();

    res.status(OK).json({
      msg: "Tag updated successfully",
      csvFilePath,
    });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({});
  }
});

export default router;
