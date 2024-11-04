import express, { Request, Response } from "express";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { BLOCK } from "../block/shared"
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import BlockModel, {Block} from "../../schemas/blockSchema"
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.post(
  BLOCK,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const object = req.body;

      if (!object) {
        throw new Error(req.originalUrl + ", msg: object was falsy: " + object);
      }

      const {code} = object;
        
      const doesExist : Document | null | undefined = await BlockModel.findOne({ code });

      if(doesExist) throw new Error("Une collection avec le code suivant existe déjà: " + code);

      // Récupérer le dernier objet trié par `code` pour auto-incrémentation
      const lastBlock = await BlockModel.findOne().sort({ code: -1 });

      // Incrémenter le code de 1
      const newCode = lastBlock ? lastBlock.code + 1 : 1;

      // Créer la nouvelle taxe avec le code auto-incrémenté
      const newObject: Block | null | undefined = new BlockModel({
        ...object,
        code: newCode,
      });

      if (!newObject) {
        throw new Error(
          req.originalUrl +
            " msg: newObject save did not work for some reason: " +
            newObject
        );
      }

      const savedObject: Block | null | undefined = await newObject.save({
        timestamps: true,
      });

      // Générer le nom du fichier exporté
      const formattedDate = getFormattedDate();
      const fileName = `PREREF_Y2_BLOCK_${formattedDate}.csv`;
      const fieldsToExport = ["code", "label", "status"]; // Ajuster selon les champs de votre modèle Block

      // Exportation CSV avec tous les champs du document
      const csvFilePath = await exportToCSV(
        savedObject?.toObject(),
        fileName,
        fieldsToExport
      );

      res.status(OK).json({
        savedObject,
        csvFilePath,
        msg: "Tax created successfully",
      });

    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

export default router;
