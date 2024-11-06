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
import CollectionModel from "../../schemas/collectionSchema";


interface ProductData {
  creator_id: string;
  reference: string;
  name: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: string[];
  suppliers: Array<{
    supplier_id: string;
    supplier_ref: number;
    pcb: string;
    custom_cat: string;
    made_in: string;
  }>;
  dimension_types: string;
  brand_ids: string[];
  collection_ids: string[];
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
  imgPath: string;
  status: string;
  additional_fields: any[];
  uvc: Array<{
    code: string;
    dimensions: any[];
    prices: Array<{
      tarif_id: string;
      currency: string;
      supplier_id: string;
      price: {
        peau: number;
        tbeu_pb: number;
        tbeu_pmeu: number;
      };
      store: string;
    }>;
    eans: string[];
    status: string;
  }>;
}

interface ProcessedProduct {
  creator_id: string;
  reference: string;
  name: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: string[];
  suppliers: Array<{
    supplier_id: string;
    supplier_ref: number;
    pcb: string;
    custom_cat: string;
    made_in: string;
  }>;
  dimension_types: string;
  brand_ids: string[];
  collection_ids: string[];
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
  imgPath: string;
  status: string;
  additional_fields: any[];
  uvc: any[];
}


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

router.post(
  PRODUCT + "/get-id",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
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
  }
);

// router.post(
//   PRODUCT,
//   authorizationMiddlewear,
//   async (req: Request, res: Response) => {
//     try {
//       const product = req.body;

//       if (!product) {
//         throw new Error(
//           req.originalUrl + ", msg: product was falsy: " + product
//         );
//       }

//       const { uvc } = product;

//       if (!uvc) {
//         throw new Error(
//           req.originalUrl +
//             " msg: There was no uvc present in the product object " +
//             product
//         );
//       }

//       const uvc_ids = [];

//       // Initialiser le générateur EAN avec vos paramètres
//       const eanGenerator = new EANGenerator(
//         "300", // Préfixe (à ajuster selon vos besoins)
//         "12345", // Talon (à ajuster selon vos besoins)
//         4 // Longueur du compteur
//       );

//       for (const u of uvc) {
//         // Si pas d'EAN, en générer un
//         if (!u.ean) {
//           try {
//             const newEan = await eanGenerator.generateEAN();
//             u.ean = newEan; // Stocke l'EAN dans le champ ean
//           } catch (error) {
//             console.error("Erreur lors de la génération de l'EAN:", error);
//             throw error;
//           }
//         } else {
//           // Vérifie si l'EAN existe déjà
//           const foundEan: Uvc | null = await UvcModel.findOne({ ean: u.ean });

//           if (foundEan) {
//             throw new Error(
//               req.originalUrl + "msg: Ean already exists: " + JSON.stringify(u)
//             );
//           }
//         }

//         const newUvc: Uvc | null = await new UvcModel({ ...u });

//         if (!newUvc) {
//           // Annule les UVC déjà créés
//           for (const _id of uvc_ids) {
//             await UvcModel.deleteOne({ _id });
//             console.log("Uvc with this model deleted! ", _id);
//           }
//           throw new Error(
//             req.originalUrl +
//               " msg: uvc save did not work for some reason: " +
//               JSON.stringify(u)
//           );
//         }

//         await newUvc.save({ timestamps: true });
//         const { _id } = newUvc;
//         uvc_ids.push(_id);
//       }

//       const newProduct: Product | null = await new ProductModel({
//         ...product,
//         uvc_ids,
//         version: 1,
//       });

//       if (!newProduct) {
//         // Annule les UVC déjà créés
//         for (const _id of uvc_ids) {
//           await UvcModel.deleteOne({ _id });
//           console.log("Uvc with this model deleted! ", _id);
//         }
//         throw new Error(
//           req.originalUrl +
//             " msg: product save did not work for some reason: " +
//             JSON.stringify(product)
//         );
//       }

//       const savedProduct: Product | null = await newProduct.save({
//         timestamps: true,
//       });
//       res.status(OK).json(savedProduct);
//     } catch (err) {
//       console.error(err);
//       res.status(INTERNAL_SERVER_ERROR).json(err);
//     }
//   }
// );

router.post(PRODUCT, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const product = req.body;
        const uvc_ids = product.uvc_ids;

        if (!product) {
            throw new Error(req.originalUrl + ", msg: product was falsy: " + JSON.stringify(product));
        }

        // Création du produit avec les IDs des UVC fournis
        const newProduct = new ProductModel({
            ...product,
            uvc_ids,
            version: 1,
        });

        const savedProduct = await newProduct.save({ timestamps: true });
        res.status(OK).json(savedProduct);

    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({ error: "erreur" });
    }
});

async function fetchTagId(code: string): Promise<string> {
  const tag = await TagModel.findOne({ code });
  if (!tag) {
    return ""; // Retourne une chaîne vide si le tag n'est pas trouvé au lieu de throw
  }
  return tag._id.toString();
}

async function fetchSupplierId(supplierId: string): Promise<string> {
  const [code, company_name] = supplierId.split(" - ");
  
  const supplier = await SupplierModel.findOne({ 
    code: code,
    company_name: company_name
  });

  if (!supplier) {
    throw new Error(`Supplier not found for code: ${code} and company: ${company_name}`);
  }

  return supplier._id.toString();
}

async function fetchBrandId(brandId: string): Promise<string> {
  const brand = await BrandModel.findOne({ label: brandId });
  if (!brand) {
    throw new Error(`Brand not found for id: ${brandId}`);
  }
  return brand._id.toString();
}

async function fetchCollectionId(collectionId: string): Promise<string> {
  const collection = await CollectionModel.findOne({ code: collectionId });
  if (!collection) {
    throw new Error(`Collection not found for id: ${collectionId}`);
  }
  return collection._id.toString();
}

router.post(PRODUCT + '/product-batch', async (req: Request, res: Response) => {
  try {
    const productsData: ProductData[] = req.body;

    if (!Array.isArray(productsData) || productsData.length === 0) {
      throw new Error('Invalid or empty products data');
    }

    const processedProducts = await Promise.all(
      productsData.map(async (productData) => {
        // Traitement des tags
        const processedTagIds = await Promise.all(
          productData.tag_ids.map(code => fetchTagId(code))
        );

        // Traitement des suppliers
        const processedSuppliers = await Promise.all(
          productData.suppliers.map(async supplier => ({
            ...supplier,
            supplier_id: await fetchSupplierId(supplier.supplier_id)
          }))
        );

        // Traitement des brands
        const processedBrandIds = await Promise.all(
          productData.brand_ids.map(brandId => fetchBrandId(brandId))
        );

        // Traitement des collections
        const processedCollectionIds = await Promise.all(
          productData.collection_ids.map(collectionId => fetchCollectionId(collectionId))
        );

        // Create processed product object
        const processedProduct: ProcessedProduct = {
          ...productData,
          tag_ids: processedTagIds.filter(id => id !== ""),
          suppliers: processedSuppliers,
          brand_ids: processedBrandIds,
          collection_ids: processedCollectionIds,
          status: 'A'
        };

        return processedProduct;
      })
    );

    res.status(200).json(processedProducts);
  } catch (error) {
    console.error('Error processing product batch:', error);
    res.status(400).json({ error: (error as Error).message });
  }
});


export default router;
