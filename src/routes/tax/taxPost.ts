import express, { Request, Response } from "express";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { TAX } from "../tax/shared";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import TaxModel, { Tax } from "../../schemas/taxSchema";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.post(
  TAX,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const object = req.body;

      if (!object) {
        throw new Error(req.originalUrl + ", msg: object was falsy: " + object);
      }

      // Récupérer le dernier objet trié par `code` pour auto-incrémentation
      const lastTax = await TaxModel.findOne().sort({ code: -1 });

      // Incrémenter le code de 1
      const newCode = lastTax ? lastTax.code + 1 : 1;

      // Créer la nouvelle taxe avec le code auto-incrémenté
      const newObject: Tax | null | undefined = new TaxModel({
        ...object,
        code: newCode, // Utiliser le nouveau code
      });

      if (!newObject) {
        throw new Error(
          req.originalUrl +
            " msg: newObject save did not work for some reason: " +
            newObject
        );
      }

      const savedObject: Tax | null | undefined = await newObject.save({
        timestamps: true,
      });

      // Générer le CSV après la sauvegarde
      const formattedDate = getFormattedDate();
      const fileName = `PREREF_Y2_TAX_${formattedDate}.csv`;
      const fieldsToExport = ["code", "label", "rate", "status"];

      // Exportation CSV avec tous les champs du document
      const csvFilePath = await exportToCSV(
        savedObject?.toObject(),
        fileName,
        fieldsToExport
      );

      res.status(OK).json({
        savedObject,
        csvFilePath,
        msg: "Tax created successfully"
      });
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

export default router;
