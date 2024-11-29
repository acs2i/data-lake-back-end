import express, { Request, Response } from 'express';
import { UVC } from './shared';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../../codes/errors';
import { Document } from 'mongoose';
import { OK } from '../../codes/success';
import authorizationMiddlewear from '../../middlewears/applicationMiddlewear';
import UvcModel, { Uvc } from '../../schemas/uvcSchema';
import { EANGenerator } from "../../services/eanGenerator";
import ProductModel from '../../schemas/productSchema';


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

router.post(UVC + '/check-eans', authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const { ean, currentEanIndex, uvcId } = req.body;
        console.log({ ean, currentEanIndex, uvcId });

        if (!ean) {
            return res.status(BAD_REQUEST).json({ error: 'EAN is required in the request body.' });
        }

        // Rechercher l'UVC contenant l'EAN
        const uvc = await UvcModel.findOne({ eans: ean }).lean();

        if (!uvc) {
            return res.status(OK).json({
                message: `The EAN ${ean} does not exist in any UVC.`,
                exists: false,
                product: null,
                uvcId: null, // Aucun UVC trouvé
            });
        }

        // Vérifier si l'UVC trouvé correspond à l'UVC en cours
        if (uvc._id.toString() === uvcId) {
            const eanIndex = uvc.eans.findIndex(existingEan => existingEan === ean);
            if (eanIndex === currentEanIndex) {
                // L'EAN est valide (il n'a pas changé)
                return res.status(200).json({
                    message: `The EAN ${ean} is valid for the same UVC and index.`,
                    exists: false,
                    product: null,
                    uvcId: uvc._id,
                });
            } else if (eanIndex !== -1) {
                // L'EAN est dans le même UVC mais à un autre index
                return res.status(200).json({
                    message: `The EAN ${ean} is already used in the same UVC at a different index (${eanIndex}).`,
                    exists: true,
                    product: null,
                    uvcId: uvc._id,
                });
            }
        }

        // Rechercher le produit associé via `product_id`
        const product = await ProductModel.findById(uvc.product_id).lean();

        return res.status(OK).json({
            message: `The EAN ${ean} exists in another UVC.`,
            exists: true,
            product: product || null,
            uvcId: uvc._id,
        });
    } catch (err) {
        console.error(err);
        return res.status(INTERNAL_SERVER_ERROR).json({
            error: 'An error occurred while checking the EAN.',
            details: "error",
        });
    }
});





export default router;
