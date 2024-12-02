import express, { Request, Response } from "express"
import { UVC } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import UvcModel from "../../schemas/uvcSchema";

const router = express.Router();

router.put(UVC + "/:id", authorizationMiddlewear, async ( req: Request, res: Response) => {
    try {

        const object = req.body;

        if(!object) {
            throw new Error(req.originalUrl + ", msg: uvc was falsy: " + object)
        }

        const _id: string | undefined | null = req.params.id;

        if(!_id) {
            throw new Error(req.originalUrl + ", msg: _id was falsy: " + _id)
        }

        const response: UpdateWriteOpResult = await UvcModel.updateOne({ _id}, {$set: object })

        if (response.acknowledged === true && response.matchedCount === 1 && response.modifiedCount === 1) {
            res.status(OK).json({ _id, ...object})
        } else{
            throw new Error(req.originalUrl + ", msg: There was a response that didn't match the needed criteria: "+response.acknowledged+" " +response.matchedCount+" "+response.modifiedCount)
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})


function generateTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mois de 01 à 12
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Backend
router.put(UVC + '/update-ean/:id', authorizationMiddlewear, async (req, res) => {
    try {
        const { ean } = req.body;

        if (!ean) {
            return res.status(400).json({ error: 'EAN is required.' });
        }

        // 1. Chercher l'UVC avec cet EAN
        const existingUvc = await UvcModel.findOne({
            eans: ean
        });

        if (!existingUvc) {
            return res.status(404).json({ 
                message: 'EAN not found in database',
                success: false
            });
        }

        // 2. Créer le nouvel EAN avec timestamp
        const timestamp = Date.now();
        const updatedEan = `zzz-${ean}-${timestamp}`;

        // 3. Mettre à jour l'EAN
        existingUvc.eans = existingUvc.eans.map(currentEan => 
            currentEan === ean ? updatedEan : currentEan
        );
        const savedUvc = await existingUvc.save();

        // 4. Retourner l'UVC complet mis à jour
        return res.status(200).json({
            message: 'EAN updated successfully',
            success: true,
            oldEan: ean,
            updatedEan: updatedEan,
            updatedUvc: savedUvc
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while updating the EAN.' });
    }
});

export default router;
