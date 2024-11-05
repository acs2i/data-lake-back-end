import express, { Request, Response } from "express";
import mongoose from "mongoose";
import ProductModel, { Product } from "../../schemas/productSchema";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import UvcModel, { Uvc } from "../../schemas/uvcSchema";
import TagModel from "../../schemas/tagSchema";
import BrandModel from "../../schemas/brandSchema";
import SupplierModel from "../../schemas/supplierSchema";

// Schéma pour le compteur EAN
const eanCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  lastCounter: { type: Number, required: true },
});

const EanCounter = mongoose.model("ean_counter", eanCounterSchema);

class EANGenerator {
  private prefix: string;
  private suffix: string;
  private counterLength: number;

  constructor(prefix: string, suffix: string, counterLength: number) {
    this.prefix = prefix;
    this.suffix = suffix;
    this.counterLength = counterLength;
  }

  private calculateChecksum(ean: string): number {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(ean[i]);
      sum += digit * (i % 2 === 0 ? 1 : 3);
    }
    const checksum = (10 - (sum % 10)) % 10;
    return checksum;
  }

  async generateEAN(): Promise<string> {
    // Vérifie la longueur totale
    if (this.prefix.length + this.suffix.length + this.counterLength !== 12) {
      throw new Error(
        "La longueur totale des composants doit être de 12 caractères"
      );
    }

    // Récupère et incrémente le compteur
    const counterDoc = await EanCounter.findOneAndUpdate(
      { _id: "ean_counter" },
      { $inc: { lastCounter: 1 } },
      { upsert: true, new: true }
    );

    if (!counterDoc) {
      throw new Error("Impossible de récupérer le compteur");
    }

    const counter = counterDoc.lastCounter
      .toString()
      .padStart(this.counterLength, "0");
    const eanWithoutChecksum = `${this.prefix}${this.suffix}${counter}`;
    const checksum = this.calculateChecksum(eanWithoutChecksum);

    return `${eanWithoutChecksum}${checksum}`;
  }
}

const router = express.Router();

router.post(PRODUCT + "/get-id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
      const { code } = req.body; // Assurez-vous que le code est extrait correctement
  
      console.log("Requête reçue avec code:", code); // Loggez le code reçu
  
      if (!code) {
        return res.status(400).json({ message: "Code non fourni" });
      }
  
      // Recherche du tag par code
      const foundTag = await TagModel.findOne({ code }, "_id code");
  
      console.log("Tag trouvé:", foundTag); // Loggez le tag trouvé
  
      if (!foundTag) {
        return res.status(404).json({ message: "Tag non trouvé pour ce code" });
      }
  
      res.status(200).json({ id: foundTag._id });
    } catch (err) {
      console.error("Erreur lors de la récupération de l'ID:", err);
      res.status(500).json({ message: "Erreur serveur", details: "erreur" });
    }
  });
   

router.post(
  PRODUCT,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const product = req.body;

      if (!product) {
        throw new Error(
          req.originalUrl + ", msg: product was falsy: " + product
        );
      }

      const { uvc } = product;

      if (!uvc) {
        throw new Error(
          req.originalUrl +
            " msg: There was no uvc present in the product object " +
            product
        );
      }

      const uvc_ids = [];

      // Initialiser le générateur EAN avec vos paramètres
      const eanGenerator = new EANGenerator(
        "300", // Préfixe (à ajuster selon vos besoins)
        "12345", // Talon (à ajuster selon vos besoins)
        4 // Longueur du compteur
      );

      for (const u of uvc) {
        // Si pas d'EAN, en générer un
        if (!u.ean) {
          try {
            const newEan = await eanGenerator.generateEAN();
            u.ean = newEan; // Stocke l'EAN dans le champ ean
          } catch (error) {
            console.error("Erreur lors de la génération de l'EAN:", error);
            throw error;
          }
        } else {
          // Vérifie si l'EAN existe déjà
          const foundEan: Uvc | null = await UvcModel.findOne({ ean: u.ean });

          if (foundEan) {
            throw new Error(
              req.originalUrl + "msg: Ean already exists: " + JSON.stringify(u)
            );
          }
        }

        const newUvc: Uvc | null = await new UvcModel({ ...u });

        if (!newUvc) {
          // Annule les UVC déjà créés
          for (const _id of uvc_ids) {
            await UvcModel.deleteOne({ _id });
            console.log("Uvc with this model deleted! ", _id);
          }
          throw new Error(
            req.originalUrl +
              " msg: uvc save did not work for some reason: " +
              JSON.stringify(u)
          );
        }

        await newUvc.save({ timestamps: true });
        const { _id } = newUvc;
        uvc_ids.push(_id);
      }

      const newProduct: Product | null = await new ProductModel({
        ...product,
        uvc_ids,
        version: 1,
      });

      if (!newProduct) {
        // Annule les UVC déjà créés
        for (const _id of uvc_ids) {
          await UvcModel.deleteOne({ _id });
          console.log("Uvc with this model deleted! ", _id);
        }
        throw new Error(
          req.originalUrl +
            " msg: product save did not work for some reason: " +
            JSON.stringify(product)
        );
      }

      const savedProduct: Product | null = await newProduct.save({
        timestamps: true,
      });
      res.status(OK).json(savedProduct);
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

export default router;
