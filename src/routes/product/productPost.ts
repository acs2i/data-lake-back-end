import express, { Request, Response } from "express";
import mongoose from 'mongoose';
import ProductModel, { Product } from "../../schemas/productSchema";
import { OK } from "../../codes/success";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import TagModel, { Tag } from "../../schemas/tagSchema";
import BrandModel, { Brand } from "../../schemas/brandSchema";
import SupplierModel, { Supplier } from "../../schemas/supplierSchema";
import CollectionModel, { Collection } from "../../schemas/collectionSchema";

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

interface ProcessedProduct extends Omit<ProductData, 'uvc'> {
  uvc: any[];
}

const router = express.Router();

router.post(
  PRODUCT + "/get-id",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const { code } = req.body;

      console.log("Requête reçue avec code:", code);

      if (!code) {
        return res.status(400).json({ message: "Code non fourni" });
      }

      const foundTag = await TagModel.findOne({ code }).lean();

      console.log("Tag trouvé:", foundTag);

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

router.post(PRODUCT, authorizationMiddlewear, async (req: Request, res: Response) => {
  try {
    const product = req.body;
    console.log("Requête reçue pour création de produit avec données :", product);

    if (!product) {
      console.error("Erreur : produit falsy", product);
      return res.status(400).json({ error: "Données de produit manquantes", status: 400 });
    }

    // Vérifie si le produit existe déjà avec cette référence
    const existingProduct = await ProductModel.findOne({ reference: product.reference });
    if (existingProduct) {
      console.log("Erreur : Produit existe déjà avec cette référence.");
      return res.status(400).json({
        error: "Cette référence existe déjà. Veuillez la modifier pour valider la création",
        status: 400,
      });
    }

    // Création du produit si la référence n'existe pas
    const newProduct = new ProductModel({
      ...product,
      uvc_ids: product.uvc_ids,
      version: 1,
    });

    const savedProduct = await newProduct.save();
    console.log("Produit sauvegardé avec succès :", savedProduct);
    return res.status(200).json(savedProduct);

  } catch (err) {
    console.error("Erreur inattendue lors de la création du produit :", err);
    return res.status(500).json({
      error: "Erreur interne du serveur lors de la création du produit.",
      status: 500,
      details:  "Erreur inconnue",
    });
  }
});



async function fetchTagId(code: string): Promise<string> {
  const tag = await TagModel.findOne({ code }).lean();
  if (!tag) {
    return "";
  }
  return tag._id.toString();
}

async function fetchSupplierId(supplierId: string): Promise<string> {
  const [code, company_name] = supplierId.split(" - ");
  
  const supplier = await SupplierModel.findOne({ 
    code: code,
    company_name: company_name
  }).lean();

  if (!supplier) {
    throw new Error(`Supplier not found for code: ${code} and company: ${company_name}`);
  }

  return supplier._id.toString();
}

async function fetchBrandId(brandId: string): Promise<string> {
  const brand = await BrandModel.findOne({ label: brandId }).lean();
  if (!brand) {
    throw new Error(`Brand not found for id: ${brandId}`);
  }
  return brand._id.toString();
}

async function fetchCollectionId(collectionId: string): Promise<string> {
  const collection = await CollectionModel.findOne({ code: collectionId }).lean();
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
        const processedTagIds = await Promise.all(
          productData.tag_ids.map(code => fetchTagId(code))
        );

        const processedSuppliers = await Promise.all(
          productData.suppliers.map(async supplier => ({
            ...supplier,
            supplier_id: await fetchSupplierId(supplier.supplier_id)
          }))
        );

        const processedBrandIds = await Promise.all(
          productData.brand_ids.map(brandId => fetchBrandId(brandId))
        );

        const processedCollectionIds = await Promise.all(
          productData.collection_ids.map(collectionId => fetchCollectionId(collectionId))
        );

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