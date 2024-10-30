import express, { Request, Response } from "express";
import { TAX } from "../tax/shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import TaxModel from "../../schemas/taxSchema";
import { OK } from "../../codes/success";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.put(TAX + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const { updateEntry, ...object } = req.body;

        if (!object) {
            throw new Error(req.originalUrl + ", msg: tax was falsy: " + JSON.stringify(object));
        }

        const _id = req.params.id;

        if (!_id) {
            throw new Error(req.originalUrl + ", msg: id was falsy: " + _id);
        }

        const tax = await TaxModel.findById(_id);
        if (!tax) {
            return res.status(404).json({ msg: "Tax not found" });
        }

        Object.assign(tax, object);

        const formattedDate = getFormattedDate();
        const fileName = `PREREF_Y2_TAX_${formattedDate}.csv`;
        const fieldsToExport = ["code", "label", "rate", "status"];

        // Exportation CSV avec tous les champs du document
        const csvFilePath = await exportToCSV(
            tax.toObject(),
            fileName,
            fieldsToExport
        );

        if (updateEntry) {
            tax.updates.push({
                updated_at: updateEntry.updated_at,
                updated_by: updateEntry.updated_by,
                changes: updateEntry.changes,
                file_name: fileName,
            });
        }

        await tax.save();

        res.status(OK).json({
            msg: "Tax updated successfully",
            csvFilePath,
        });
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({});
    }
});

export default router;
