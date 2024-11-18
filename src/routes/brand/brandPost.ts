import express, { Request, Response } from "express";
import BrandModel from "../../schemas/brandSchema";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { BRAND } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { getFormattedDate } from "../../services/formatDate";
import { exportToCSV } from "../../services/csvExportUtil";

const router = express.Router();

router.post(
  BRAND,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const object = req.body;

      if (!object) {
        return res.status(400).json({
          error: "Données de marque manquantes",
          status: 400,
        });
      }

      // Recherche du plus grand code existant
      const maxCodeBrand = await BrandModel.aggregate([
        {
          $group: {
            _id: null,
            maxCode: { $max: { $toInt: "$code" } }
          }
        }
      ]);

      // Détermination du nouveau code
      const lastCode = maxCodeBrand.length > 0 ? maxCodeBrand[0].maxCode : 0;
      const newCode = lastCode + 1;

      // Vérification si le nouveau code existe déjà
      const existingBrand = await BrandModel.findOne({ code: newCode });
      if (existingBrand) {
        return res.status(409).json({
          error: `Une marque avec le code "${newCode}" existe déjà.`,
          status: 409,
        });
      }

      // Création de la marque avec le nouveau code
      const newObject = new BrandModel({
        ...object,
        code: newCode,
      });
      
      const savedObject = await newObject.save({ timestamps: true });

      if (savedObject) {
        const formattedDate = getFormattedDate();
        const fileName = `PREREF_Y2_MAR_${formattedDate}.csv`;
        const fieldsToExport = ["code", "label", "status"];
        const csvFilePath = await exportToCSV(savedObject.toObject(), fileName, fieldsToExport);

        res.status(200).json({
          savedObject,
          csvFilePath,
          msg: "Brand created successfully",
        });
      } else {
        throw new Error("Failed to save the object");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Erreur interne du serveur lors de la création de la marque",
        status: 500,
      });
    }
  }
);

export default router;
