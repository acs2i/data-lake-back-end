import express, { Request, Response } from 'express';
import { UVC } from './shared';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../../codes/errors';
import { Document } from 'mongoose';
import { OK } from '../../codes/success';
import authorizationMiddlewear from '../../middlewears/applicationMiddlewear';
import UvcModel, { Uvc } from '../../schemas/uvcSchema';
import { EANGenerator } from "../../services/eanGenerator";

const router = express.Router();

router.post(UVC, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const object = req.body;
        if (!object) {
            throw new Error(req.originalUrl + ", msg: uvc was falsy: " + object);
        }

        // Initialisation du générateur EAN
        const eanGenerator = new EANGenerator(
            "02000",     // Préfixe
            "0",   // Talon
            6         // Longueur du compteur
        );

        // Si pas d'EAN, en générer un
        if (!object.ean) {
            try {
                const { ean, barcodePath } = await eanGenerator.generateEAN();
                object.ean = ean;
                object.barcodePath = barcodePath; // Stockage du chemin de l'image
            } catch (error) {
                console.error("Erreur lors de la génération de l'EAN:", error);
                throw error;
            }
        } else {
            // Vérifie si l'EAN existe déjà
            const foundEan: Uvc | null = await UvcModel.findOne({ ean: object.ean });
            if (foundEan) {
                throw new Error(req.originalUrl + " msg: Ean already exists: " + JSON.stringify(object));
            }
            // Générer le code-barres pour l'EAN existant
            const barcodePath = eanGenerator.generateBarcode(object.ean);
            object.barcodePath = barcodePath;
        }

        // Si l'array eans n'existe pas, le créer
        if (!object.eans) {
            object.eans = [];
        }
        
        // Ajouter le nouvel EAN à l'array eans s'il n'y est pas déjà
        if (object.ean && !object.eans.includes(object.ean)) {
            object.eans.push(object.ean);
        }

        const newObject: Document | null | undefined = await new UvcModel({ ...object });

        if (!newObject) {
            throw new Error(req.originalUrl + " msg: uvc save did not work for some reason: " + object);
        }

        const savedUvc: Document | null | undefined = await newObject.save({ timestamps: true });

        const _id = savedUvc._id;

        const result = { ...object, _id };

        res.status(OK).json(result);
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err);
    }
});

export default router;
