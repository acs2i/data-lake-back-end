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
import DimensionGridModel from "../../schemas/dimensionGridSchema";

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

async function fetchTagId(code: string): Promise<string> {
  const tag = await TagModel.findOne({ code }).lean();
  if (!tag) {
    return "";
  }
  return tag._id.toString();
}

async function fetchSupplierId(companyName: string): Promise<string> {
  const supplier = await SupplierModel.findOne({
    company_name: companyName,
  }).lean();

  if (!supplier) {
    throw new Error(`Supplier not found for company: ${companyName}`);
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

    // Conversion des valeurs en IDs
    try {
      product.tag_ids = await Promise.all(
        (product.tag_ids || []).map((tagCode: string) => fetchTagId(tagCode))
      );

      // Récupération des IDs des fournisseurs en utilisant `company_name`
      product.suppliers = await Promise.all(
        (product.suppliers || []).map(async (supplierDetail: { supplier_id: string }) => {
          const supplierId = await fetchSupplierId(supplierDetail.supplier_id);
          return {
            ...supplierDetail,
            supplier_id: supplierId,
          };
        })
      );

      product.brand_ids = await Promise.all(
        (product.brand_ids || []).map((brandLabel: string) => fetchBrandId(brandLabel))
      );

      product.collection_ids = await Promise.all(
        (product.collection_ids || []).map((collectionCode: string) => fetchCollectionId(collectionCode))
      );

      // Création du produit avec les IDs récupérés
      const newProduct = new ProductModel({
        ...product,
        uvc_ids: product.uvc_ids,
        version: 1,
      });

      const savedProduct = await newProduct.save();
      console.log("Produit sauvegardé avec succès :", savedProduct);
      return res.status(200).json(savedProduct);

    } catch (error) {
      console.error("Erreur lors de la récupération des IDs :", error);
      return res.status(500).json({
        error: "Erreur lors de la récupération des IDs des tags, fournisseurs, marques ou collections.",
        status: 500,
      });
    }

  } catch (err) {
    console.error("Erreur inattendue lors de la création du produit :", err);
    return res.status(500).json({
      error: "Erreur interne du serveur lors de la création du produit.",
      status: 500,
      details: "Erreur inconnue",
    });
  }
});


async function fetchSizesByIndices(gridCode: string, indices: number[]): Promise<string[]> {
  // Récupère la grille de dimensions en fonction du `gridCode`
  const dimensionGrid = await DimensionGridModel.findOne({ code: gridCode }).lean();

  if (!dimensionGrid) {
    throw new Error("Grille de dimensions non trouvée pour ce code");
  }

  const dimensions = indices
    .map(index => dimensionGrid.dimensions[index - 1]) 
    .filter(Boolean);

  return dimensions;
}



router.post(PRODUCT + '/get-dimensions-by-index', async (req: Request, res: Response) => {
  try {
    const { gridCode, indices } = req.body;

    if (!gridCode || !Array.isArray(indices)) {
      return res.status(400).json({ error: "Code de grille et indices sont requis." });
    }

    const dimensions = await fetchSizesByIndices(gridCode, indices);

    res.status(200).json({ dimensions });
  } catch (error) {
    console.error("Erreur lors de la récupération des dimensions :", error);
    res.status(400).json({ error: (error as Error).message });
  }
});


async function fetchTagLabel(code: string): Promise<string> {
  const tag = await TagModel.findOne({ code }).lean();
  return tag ? tag.name : "Unknown Tag";
}

async function fetchSupplierName(supplierId: string): Promise<string> {
  const [code, company_name] = supplierId.split(" - ");
  const supplier = await SupplierModel.findOne({ code, company_name }).lean();
  return supplier ? supplier.company_name : "Unknown Supplier";
}

async function fetchBrandLabel(brandId: string): Promise<string> {
  const brand = await BrandModel.findOne({ label: brandId }).lean();
  return brand ? brand.label : "Unknown Brand";
}

async function fetchCollectionLabel(collectionId: string): Promise<string> {
  const collection = await CollectionModel.findOne({ code: collectionId }).lean();
  return collection ? collection.code : "Unknown Collection";
}

router.post(PRODUCT + '/product-batch', async (req: Request, res: Response) => {
  try {
    const productsData: ProductData[] = req.body;

    const processedProducts = await Promise.all(
      productsData.map(async (productData) => {
        const processedTagLabels = await Promise.all(
          productData.tag_ids.map(code => fetchTagLabel(code))
        );

        const processedSuppliers = await Promise.all(
          productData.suppliers.map(async (supplier) => ({
            ...supplier,
            supplier_id: await fetchSupplierName(supplier.supplier_id)
          }))
        );

        const processedBrandLabels = await Promise.all(
          productData.brand_ids.map(brandId => fetchBrandLabel(brandId))
        );

        const processedCollectionLabels = await Promise.all(
          productData.collection_ids.map(collectionId => fetchCollectionLabel(collectionId))
        );

        return {
          ...productData,
          tag_ids: productData.tag_ids,
          suppliers: processedSuppliers,
          brand_ids: processedBrandLabels,
          collection_ids: processedCollectionLabels,
          status: 'A'
        };
      })
    );

    res.status(200).json(processedProducts);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;