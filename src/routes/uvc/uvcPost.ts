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

        // Rechercher par EAN plutôt que par _id
        const existingUvc = object.ean ? await UvcModel.findOne({ ean: object.ean }) : null;

        if (existingUvc) {
            // Si l'UVC existe déjà, garder son EAN et son barcodePath
            object.ean = existingUvc.ean;
            object.barcodePath = existingUvc.barcodePath;
            // Mettre à jour l'UVC existante
            const updatedUvc = await UvcModel.findByIdAndUpdate(existingUvc._id, object, { new: true });
            return res.status(OK).json(updatedUvc);
        }

        // Si c'est une nouvelle UVC
        const eanGenerator = new EANGenerator(
            process.env.EAN_PREFIX || "",     // Préfixe
            process.env.EAN_TALON || "",         // Talon
            Number(process.env.EAN_COMPTEUR)
        );

        // Générer un nouvel EAN uniquement si aucun n'est fourni
        if (!object.ean) {
            try {
                const { ean, barcodePath } = await eanGenerator.generateEAN();
                object.ean = ean;
                object.barcodePath = barcodePath;
            } catch (error) {
                console.error("Erreur lors de la génération de l'EAN:", error);
                throw error;
            }
        } else {
            // Vérifier si l'EAN fourni existe déjà
            const foundEan = await UvcModel.findOne({ ean: object.ean });
            if (foundEan) {
                throw new Error(req.originalUrl + " msg: Ean already exists: " + JSON.stringify(object));
            }
            // Générer le code-barres pour l'EAN existant
            const barcodePath = eanGenerator.generateBarcode(object.ean);
            object.barcodePath = barcodePath;
        }

        // Gestion de l'array eans
        if (!object.eans) {
            object.eans = [];
        }
        if (object.ean && !object.eans.includes(object.ean)) {
            object.eans.push(object.ean);
        }

        // Créer une nouvelle UVC
        const newObject = new UvcModel(object);
        const savedUvc = await newObject.save({ timestamps: true });

        if (!savedUvc) {
            throw new Error(req.originalUrl + " msg: uvc save did not work for some reason: " + object);
        }

        res.status(OK).json(savedUvc);
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err);
    }
});

// router.post(UVC, authorizationMiddlewear, async (req: Request, res: Response) => {
//     try {
//         const object = req.body;

//         if (!object) {
//             throw new Error(req.originalUrl + ", msg: uvc was falsy: " + object);
//         }

//         const existingUvc = await UvcModel.findById(object._id);

//         // Si l’UVC existe déjà et a un EAN, le garder tel quel
//         if (existingUvc && existingUvc.ean) {
//             object.ean = existingUvc.ean;
//             object.barcodePath = existingUvc.barcodePath;
//         } else {
//             // Générer un nouvel EAN uniquement si l’UVC n’a pas encore d’EAN
//             const eanGenerator = new EANGenerator("02000", "0", 6);

//             let generatedEan, barcodePath;
//             do {
//                 const { ean: newEan, barcodePath: newBarcodePath } = await eanGenerator.generateEAN();
//                 const eanExists = await UvcModel.exists({ ean: newEan });

//                 if (!eanExists) {
//                     generatedEan = newEan;
//                     barcodePath = newBarcodePath;
//                     break;
//                 }
//             } while (!generatedEan);

//             object.ean = generatedEan;
//             object.barcodePath = barcodePath;
//         }

//         // Ajouter l'EAN dans l'array eans si ce n’est pas déjà fait
//         if (!object.eans) {
//             object.eans = [];
//         }
//         if (object.ean && !object.eans.includes(object.ean)) {
//             object.eans.push(object.ean);
//         }

//         // Sauvegarder l'UVC mis à jour ou nouveau
//         const savedUvc = existingUvc
//             ? await UvcModel.findByIdAndUpdate(existingUvc._id, object, { new: true })
//             : await new UvcModel(object).save();

//         res.status(OK).json(savedUvc);
//     } catch (err) {
//         console.error(err);
//         res.status(INTERNAL_SERVER_ERROR).json(err);
//     }
// });


export default router;
