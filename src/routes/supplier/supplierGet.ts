import express, { Request, Response } from "express";
import { SUPPLIER } from "./shared";
import SupplierModel, { Supplier } from "../../schemas/supplierSchema";
import { generalLimits } from "../../services/generalServices";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { BAD_REQUEST } from "../../codes/errors";
import { OK } from "../../codes/success";

const router = express.Router();

router.get(
  SUPPLIER + "/search",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const { intLimit, skip } = await generalLimits(req);

      let filter: any = { $and: [] }; // Utilisation d'un objet vide pour stocker les filtres

      const { code, company_name, address, city, status, country } = req.query;

      if (code) {
        const $regEx = new RegExp(code as string, "i");
        filter.$and.push({ code: $regEx });
      }

      if (company_name) {
        const $regEx = new RegExp(company_name as string, "i");
        filter.$and.push({ company_name: $regEx });
      }

      if (address) {
        const $regEx = new RegExp(address as string, "i");
        // Recherche dans les trois champs liés aux adresses
        filter.$and.push({
          $or: [
            { address_1: $regEx },
            { address_2: $regEx },
            { address_3: $regEx }
          ],
        });
      }

      if (city) {
        const $regEx = new RegExp(city as string, "i");
        filter.$and.push({ city: $regEx });
      }

      if (status) {
        const $regEx = new RegExp(status as string, "i");
        filter.$and.push({ status: $regEx });
      }

      if (country) {
        const $regEx = new RegExp(country as string, "i");
        filter.$and.push({ country: $regEx });
      }

      if (Object.keys(filter).length === 0) {
        throw new Error("Aucun critère de recherche valide fourni.");
      }

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
