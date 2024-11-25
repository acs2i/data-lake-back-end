import express, { Request, Response } from "express";
import { SUPPLIER } from "./shared";
import SupplierModel, { Supplier } from "../../schemas/supplierSchema";
import { generalLimits } from "../../services/generalServices";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import { exportToCSV } from "../../services/csvExportUtil";

const router = express.Router();

router.get(
  SUPPLIER + "/search",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const { intLimit, skip } = await generalLimits(req);

      let filter: any = {}; // Utilisation d'un objet vide pour stocker les filtres

      const { code, company_name, address, city, status, country } = req.query;

      const andConditions: any[] = [];

      // Ajouter les conditions si elles existent
      if (code) {
        const $regEx = new RegExp(code as string, "i");
        andConditions.push({ code: $regEx });
      }

      if (company_name) {
        const $regEx = new RegExp(company_name as string, "i");
        andConditions.push({ company_name: $regEx });
      }

      if (address) {
        const $regEx = new RegExp(address as string, "i");
        andConditions.push({
          $or: [
            { address1: $regEx },
            { address2: $regEx },
            { address3: $regEx }
          ],
        });
      }

      if (city) {
        const $regEx = new RegExp(city as string, "i");
        andConditions.push({ city: $regEx });
      }

      if (status && status !== "") {
        const $regEx = new RegExp(status as string, "i");
        andConditions.push({ status: $regEx });
      }

      if (country) {
        const $regEx = new RegExp(country as string, "i");
        andConditions.push({ country: $regEx });
      }

      // Si des conditions existent, ajoute l'opérateur $and
      if (andConditions.length > 0) {
        filter.$and = andConditions;
      }

      // Effectuer la recherche même si aucun critère n'a été fourni
      const data = await SupplierModel.find(filter).skip(skip).limit(intLimit);

      if (!data) {
        throw new Error("Erreur lors de la recherche des fournisseurs.");
      }

      const total = await SupplierModel.countDocuments(filter);

      res.status(200).json({ data, total });
    } catch (err) {
      console.error(err);
      res.status(500).json("erreur");
    }
  }
);

router.get(SUPPLIER + "/field/:field/value/:value", async (req: Request, res: Response) => {
  try {
      const { value , field } = req.params;

      const data : Supplier[] | null | undefined = await SupplierModel.find({
        [field]: { $regex: new RegExp(`^${value}$`, "i") }
      }); 
        // we find all in case the edge case of different level families with same name
  
      if ( data === null ||  data === undefined) {
          throw new Error(req.originalUrl + ", msg: find error")
      }
      
      res.status(OK).json(data);
  }
  catch(err) {
      console.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({})
  }

})



router.get(
  SUPPLIER,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const { intLimit, skip } = await generalLimits(req);

      const data: Supplier[] | null | undefined = await SupplierModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(intLimit);

      if (data === null || data === undefined) {
        throw new Error(req.originalUrl + ", msg: find error");
      }

      const total = await SupplierModel.countDocuments({});

      res.status(200).json({ data, total });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
);

router.get(SUPPLIER + "/export/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try {
      // Récupère le supplier depuis la base de données
      const supplier = await SupplierModel.findById(id);

      if (!supplier) {
          return res.status(404).json({ error: "Supplier not found" });
      }

      // Nom du fichier CSV
      const fileName = `supplier_export_${new Date().toISOString()}.csv`;
      console.log(fileName)
      // Champs à inclure dans le CSV
      const fieldsToExport = [
          "code", "company_name", "phone", "email", "web_url",
          "siret", "tva", "address1", "address2", "address3",
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

router.get(
  SUPPLIER + "/:id",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      // Typifiez explicitement le document retourné par Mongoose
      const document = await SupplierModel.findById(id).populate("brand_id") as (Supplier & Document) | null;

      if (!document) {
        res.status(404).json({ error: "Supplier not found" });
        return;
      }

      res.status(200).json(document);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
      console.error(err);
    }
  }
);




export default router;
