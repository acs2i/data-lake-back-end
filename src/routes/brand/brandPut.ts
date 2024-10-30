import express, { Request, Response } from "express";
import { BRAND } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import BrandModel from "../../schemas/brandSchema";
import { OK } from "../../codes/success";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.put(BRAND + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const { updateEntry, ...object } = req.body;

        if (!object) {
            throw new Error(req.originalUrl + ", msg: brand was falsy: " + JSON.stringify(object));
        }

        const _id: string | undefined | null = req.params.id;

        if (!_id) {
            throw new Error(req.originalUrl + ", msg: id was falsy: " + _id);
        }

        // Récupérer le document pour mise à jour
        const brand = await BrandModel.findById(_id);
        if (!brand) {
            return res.status(404).json({ msg: "Brand not found" });
        }

        // Mettre à jour les champs modifiés
        Object.assign(brand, object);

        // Générer le nom du fichier exporté
        const formattedDate = getFormattedDate();
        const fileName = `PREREF_Y2_MAR_${formattedDate}.csv`;
        const fieldsToExport = ["code", "label", "status"];

        // Exportation CSV avec tous les champs du document
        const csvFilePath = await exportToCSV(
            brand.toObject(),
            fileName,
            fieldsToExport
        );

        if (updateEntry) {
            brand.updates.push({
                updated_at: updateEntry.updated_at,
                updated_by: updateEntry.updated_by,
                changes: updateEntry.changes,
                file_name: fileName,
            });
        }

        // Sauvegarder les modifications et l'historique
        await brand.save();

        res.status(OK).json({
            msg: "Brand updated successfully",
            csvFilePath,
        });
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({});
    }
});

export default router;
