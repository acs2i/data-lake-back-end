import express, { Request, Response } from "express";
import { COLLECTION } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import CollectionModel from "../../schemas/collectionSchema";
import { OK } from "../../codes/success";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.put(COLLECTION + "/:id", async (req: Request, res: Response) => {
  try {
    const { updateEntry, ...object } = req.body;

    if (!object) {
      throw new Error(
        req.originalUrl +
          ", msg: collection was falsy: " +
          JSON.stringify(object)
      );
    }

    const _id: string | undefined | null = req.params.id;

    if (!_id) {
      throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id);
    }

    // Récupérer le document pour mise à jour
    const collection = await CollectionModel.findById(_id);
    if (!collection) {
      return res.status(404).json({ msg: "Collection not found" });
    }

    // Mettre à jour les champs modifiés
    Object.assign(collection, object);

    // Générer le nom du fichier exporté
    // const formattedDate = getFormattedDate();
    // const fileName = `PREREF_Y2_COL_${formattedDate}.csv`;
    // const fieldsToExport = ["code", "label", "status"];

    // // Exportation CSV avec tous les champs du document
    // const csvFilePath = await exportToCSV(
    //   collection.toObject(),
    //   fileName,
    //   fieldsToExport
    // );

    // Ajouter `updateEntry` dans le tableau `updates` avec `file_name`
    if (updateEntry) {
      collection.updates.push({
        updated_at: updateEntry.updated_at,
        updated_by: updateEntry.updated_by,
        changes: updateEntry.changes,
        // file_name: fileName, // Ajout du nom du fichier dans l'entrée d'historique
      });
    }

    // Sauvegarder les modifications et l'historique
    // await collection.save();

    // res.status(OK).json({
    //   msg: "Collection updated successfully",
    //   // csvFilePath,
    // });

    const result = await collection.save();

    if (result) {
      // Générer le nom du fichier exporté
      const formattedDate = getFormattedDate();
      const fileName = `PREREF_Y2_COL_${formattedDate}.csv`;
      const fieldsToExport = ["code", "label", "status"];

      // Exportation CSV avec tous les champs du document
      const csvFilePath = await exportToCSV(
        collection.toObject(),
        fileName,
        fieldsToExport
      );

      res.status(OK).json({
        msg: "Collection updated successfully",
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
