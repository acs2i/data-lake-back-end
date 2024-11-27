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

router.put(UVC + '/update-ean/:id', authorizationMiddlewear, async (req, res) => {
    try {
        const { id } = req.params; // Récupérer l'ID de l'UVC depuis l'URL
        const { ean, eanIndex } = req.body; // Récupérer les données depuis le corps

        // Vérification des paramètres
        if (!ean || eanIndex === undefined) {
            return res.status(400).json({ error: 'EAN and eanIndex are required.' });
        }

        // Rechercher l'UVC correspondant
        const uvc = await UvcModel.findById(id);

        if (!uvc) {
            return res.status(404).json({ error: `UVC with ID ${id} not found.` });
        }

        // Générer une nouvelle valeur d'EAN
        const timestamp = generateTimestamp();
        const newEan = `zzz-${ean}-${timestamp}`;

        // Modifier l'EAN à l'index donné
        uvc.eans[eanIndex] = newEan;

        // Sauvegarder les modifications
        await uvc.save();

        return res.status(200).json({
            message: `EAN updated successfully to ${newEan}.`,
            newEan,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while updating the EAN.' });
    }
});


export default router;
