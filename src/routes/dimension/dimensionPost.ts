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
        return res.status(400).json({
          error: "Données de dimension manquantes",
          status: 400
        });
      }

      const { type, code } = object;

      // Vérifiez si une dimension avec le même type et code existe déjà
      const doesExist = await DimensionModel.findOne({ type, code });

      if (doesExist) {
        return res.status(409).json({
          msg: `Une dimension avec le type "${type}" et le code "${code}" existe déjà.`,
          status: 409
        });
      }

      // Création de la dimension si la combinaison type-code n'existe pas
      const newObject = new DimensionModel({ ...object });
      const result = await newObject.save({ timestamps: true });

      if (result) {
        const formattedDate = getFormattedDate();
        const fileName = `PREREF_Y2_DIM_${formattedDate}.csv`;
        const fieldsToExport = ["type", "code", "label", "status"];

        const csvFilePath = await exportToCSV(result.toObject(), fileName, fieldsToExport);

        res.status(200).json({
          result,
          csvFilePath,
          msg: "Dimension créée avec succès"
        });
      } else {
        throw new Error("Échec de la sauvegarde de l'objet");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Erreur interne du serveur lors de la création de la dimension",
        status: 500
      });
    }
  }
);



export default router;
