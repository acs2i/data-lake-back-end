import express, { Request, Response } from "express";
const router = express.Router();
import { exportToCSV } from '../../services/csvExportUtil';
import { CSV } from './shared';
import { exportToCSVArray } from "../../services/csvExportArrayUtil";
import ProductModel from "../../schemas/productSchema";
import SupplierModel from "../../schemas/supplierSchema";



// Assurez-vous que cette route backend génère et renvoie le fichier CSV
router.get(CSV + "/export/supplier/:id", async (req, res) => {
  try {
      // Récupère le supplier depuis la base de données
      const supplierId = req.params.id;
      const supplier = await SupplierModel.findById(supplierId).lean();

      if (!supplier) {
          return res.status(404).json({ error: "Supplier not found" });
      }

      // Nom du fichier CSV
      const fileName = `supplier_export_${new Date().toISOString()}.csv`;
      
      // Champs à inclure dans le CSV
      const fieldsToExport = [
          "code", "company_name", "phone", "email", "web_url",
          "siret", "tva", "address_1", "address_2", "address_3",
          "city", "postal", "country", "currency"
      ];

      // Générer le fichier CSV et obtenir le chemin du fichier
      const filePath = await exportToCSV(supplier, fileName, fieldsToExport);

      // Envoyer le fichier en tant que réponse pour le téléchargement
      res.download(filePath, fileName, (err) => {
          if (err) {
              console.error("Erreur lors du téléchargement du fichier CSV :", err);
              res.status(500).send("Erreur lors du téléchargement du fichier CSV");
          }
      });
  } catch (error) {
      console.error("Erreur lors de l'export CSV :", error);
      res.status(500).json({ error: "Erreur lors de l'export CSV" });
  }
});



  

export default router;