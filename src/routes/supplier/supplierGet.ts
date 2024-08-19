import express, { Request, Response } from "express"
import { SUPPLIER } from "./shared";
import SupplierModel, { Supplier } from "../../schemas/supplierSchema";
import { generalLimits } from "../../services/generalServices";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { BAD_REQUEST } from "../../codes/errors";
import { OK } from "../../codes/success";

const router = express.Router();

router.get(SUPPLIER + "/search", authorizationMiddlewear, async(req: Request, res: Response) => {
  try {
      const { intLimit, skip } = await generalLimits(req);

      let filter: any = {};  // Utilisation d'un objet vide pour stocker les filtres

      const { code, company_name, address, status, country } = req.query;

      // Filtrer par `code` si présent
      if (code) {
          filter.code = new RegExp(code as string, "i");
      }

      // Filtrer par `company_name` si présent
      if (company_name) {
          filter.company_name = new RegExp(company_name as string, "i");
      }

      // Filtrer par `address` si présent
      if (address) {
          filter.address = new RegExp(address as string, "i");
      }

      // Filtrer par `status` si présent
      if (status) {
          filter.status = new RegExp(status as string, "i");
      }

      // Filtrer par `country` si présent
      if (country) {
          filter.country = new RegExp(country as string, "i");
      }

      // Vérifier qu'au moins un critère de recherche est présent
      if (Object.keys(filter).length === 0) {
          throw new Error("Aucun critère de recherche valide fourni.");
      }

      // Exécuter la requête avec les filtres
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
});





  router.get(SUPPLIER, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
      const { intLimit, skip } = await generalLimits(req);
  
      const data: Supplier[] | null | undefined = await SupplierModel.find()
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(intLimit);
  
      if (data === null || data === undefined) {
        throw new Error(req.originalUrl + ", msg: find error")
      }
  
      const total = await SupplierModel.countDocuments({});
  
      res.status(200).json({ data, total });
    } catch (err) {
      console.error(err)
      res.status(500).json(err);
    }
  });
  

router.get(SUPPLIER + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Document | null | undefined = await SupplierModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: Document was null or undefined");
            return;
        }

        res.status(OK).json(document)

    }
    catch(err) {
        res.status(BAD_REQUEST).json(err)
        console.error(err)
    }


})
    


export default router;