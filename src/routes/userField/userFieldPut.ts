import express, { Request, Response } from "express";
import { USERFIELD } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import UserFieldModel from "../../schemas/userFieldSchema";
import { OK } from "../../codes/success";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.put(USERFIELD + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const { updateEntry, ...object } = req.body;

        if (!object) {
            throw new Error(req.originalUrl + ", msg: userField was falsy: " + JSON.stringify(object));
        }

        const _id = req.params.id;

        if (!_id) {
            throw new Error(req.originalUrl + ", msg: id was falsy: " + _id);
        }

        const userField = await UserFieldModel.findById(_id);
        if (!userField) {
            return res.status(404).json({ msg: "UserField not found" });
        }

        Object.assign(userField, object);

        const formattedDate = getFormattedDate();
        const fileName = `PREREF_Y2_USERFIELD_${formattedDate}.csv`;
        const fieldsToExport = ["code", "label", "status"];

        const csvFilePath = await exportToCSV(
            userField.toObject(),
            fileName,
            fieldsToExport
        );

        if (updateEntry) {
            userField.updates.push({
                updated_at: updateEntry.updated_at,
                updated_by: updateEntry.updated_by,
                changes: updateEntry.changes,
                file_name: fileName,
            });
        }

        await userField.save();

        res.status(OK).json({
            msg: "UserField updated successfully",
            csvFilePath,
        });
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({});
    }
});

export default router;
