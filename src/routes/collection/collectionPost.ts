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
        return res.status(400).json({ error: "Données de collection manquantes" });
      }

      const { code } = object;
      const doesExist = await CollectionModel.findOne({ code });

      if (doesExist) {
        console.log("Erreur : Collection existe déjà avec ce code.");
        return res.status(409).json({
          msg: "Une collection avec le code suivant existe déjà: " + code,
          status: 409,
        });
      }

      // Création de la nouvelle collection si le code n'existe pas
      const newObject = new CollectionModel({ ...object });
      const savedCollection = await newObject.save({ timestamps: true });

      if (savedCollection) {
        const formattedDate = getFormattedDate();
        const fileName = `PREREF_Y2_COL_${formattedDate}.csv`;
        const fieldsToExport = ["code", "label", "status"];
        const csvFilePath = await exportToCSV(savedCollection.toObject(), fileName, fieldsToExport);

        res.status(200).json({
          savedCollection,
          csvFilePath,
          msg: "Collection créée avec succès",
        });
      } else {
        throw new Error("Échec de la sauvegarde de la collection");
      }

    } catch (err) {
      console.error("Erreur lors de la création de la collection :", err);
      res.status(500).json({
        error: "Erreur interne du serveur lors de la création de la collection",
        status: 500,
      });
    }
  }
);


export default router;
