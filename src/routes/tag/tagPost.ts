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
        return res.status(400).json({
          error: "Données de tag manquantes",
          status: 400,
        });
      }

      const { level, code } = object;

      // Vérifiez que les valeurs de level et code sont bien définies
      if (!level || !code) {
        return res.status(400).json({
          error: "Le niveau (level) et le code sont requis pour créer un tag",
          status: 400,
        });
      }

      // Log pour vérifier les valeurs de level et code
      console.log("Vérification du tag avec level:", level, "et code:", code);

      // Vérifiez si un tag avec le même niveau et code existe déjà
      const doesExist = await TagModel.findOne({ level, code });

      if (doesExist) {
        console.log("Conflit détecté : un tag avec ce niveau et code existe déjà.");
        return res.status(409).json({
          msg: `Un tag avec le niveau "${level}" et le code "${code}" existe déjà.`,
          status: 409,
        });
      }

      // Création du tag si la combinaison level-code n'existe pas
      const newObject = new TagModel({ ...object });
      const savedObject = await newObject.save();

      if (savedObject) {
        const formattedDate = getFormattedDate();
        const fileName = `PREREF_Y2_TAG_${formattedDate}.csv`;
        const fieldsToExport = ["level", "code", "label", "status"];
        const csvFilePath = await exportToCSV(savedObject.toObject(), fileName, fieldsToExport);

        res.status(200).json({
          savedObject,
          csvFilePath,
          msg: "Tag créé avec succès",
        });
      } else {
        throw new Error("Échec de la sauvegarde de l'objet");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Erreur interne du serveur lors de la création du tag",
        status: 500,
      });
    }
  }
);

export default router;
