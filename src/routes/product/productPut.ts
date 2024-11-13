import express, { Request, Response } from "express";
import { PRODUCT } from "./shared";
import { UpdateWriteOpResult } from "mongoose";
import { OK } from "../../codes/success";
import ProductModel, { Product } from "../../schemas/productSchema";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

const isEqual = (a: any, b: any): boolean => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return (
        a.length === b.length &&
        a.every((element, index) => isEqual(element, b[index]))
      );
    } else if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      return (
        keysA.length === keysB.length &&
        keysA.every((key) => isEqual(a[key], b[key]))
      );
    }
    return a === b;
  };

  router.put(PRODUCT + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
      const { updateEntry, ...product } = req.body;
      const uvc_ids = product.uvc_ids;
      const _id: string | undefined | null = req.params.id;
  
      if (!product || !_id) {
        throw new Error(req.originalUrl + ", msg: product or _id was falsy");
      }
  
      // Récupérer le document actuel du produit avant la mise à jour
      const oldProduct: Product | null = await ProductModel.findById(_id);
      if (!oldProduct) {
        return res.status(404).json({ msg: "Product not found" });
      }
  
      // Comparaison des champs pour capturer uniquement les modifications réelles
      const changes = Object.keys(product).reduce((acc, key) => {
        const typedKey = key as keyof Product;
        const oldValue = oldProduct[typedKey];
        const newValue = product[typedKey];
  
        if (!isEqual(oldValue, newValue)) {
          acc[typedKey] = {
            oldValue,
            newValue,
          };
        }
        return acc;
      }, {} as Record<string, { oldValue: any; newValue: any }>);
  
      // Mise à jour des données du produit
      let updatedProductData = { ...product };
      if (uvc_ids && uvc_ids.length > 0) {
        updatedProductData.uvc_ids = uvc_ids;
      }
  
      // Appliquer les modifications et sauvegarder
      const response: UpdateWriteOpResult = await ProductModel.updateOne({ _id }, { $set: updatedProductData });
      if (response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
  
        // Générer le nom de fichier CSV
        const formattedDate = getFormattedDate();
        const fileName = `PRODUCT_UPDATE_${formattedDate}.csv`;
        const fieldsToExport = ["reference", "alias", "short_label", "long_label", "status", "uvc_ids", "brand_ids", "collection_ids", "suppliers", "tag_ids"];
        
        // Convertir le produit en objet et générer le fichier CSV
        const csvFilePath = await exportToCSV(
          { ...oldProduct.toObject(), ...updatedProductData },
          fileName,
          fieldsToExport
        );
  
        // Ajouter l'entrée `updateEntry` avec les changements détectés si elle existe
        if (updateEntry && Object.keys(changes).length > 0) { // Ajouter uniquement si des changements existent
          oldProduct.updates.push({
            updated_at: updateEntry.updated_at,
            updated_by: updateEntry.updated_by,
            changes,  // Ajout des changements détaillés
            file_name: fileName,
          });
          await oldProduct.save();
        }
  
        res.status(OK).json({
          msg: "Product updated successfully",
          csvFilePath,
        });
      } else {
        throw new Error("Product update did not meet success criteria");
      }
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json({ msg: "Error updating product and generating CSV" });
    }
  });

export default router;
