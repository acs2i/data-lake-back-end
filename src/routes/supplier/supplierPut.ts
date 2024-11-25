import express, { Request, Response } from "express";
import { SUPPLIER } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import SupplierModel from "../../schemas/supplierSchema";
import { OK } from "../../codes/success";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.put(
  SUPPLIER + "/:id",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const object = req.body;

      if (!object) {
        throw new Error(
          req.originalUrl + ", msg: supplier was falsy: " + JSON.stringify(object)
        );
      }

      const _id: string | undefined | null = req.params.id;

      if (!_id) {
        throw new Error(req.originalUrl + ", msg: id was falsy: " + _id);
      }

      const supplier = await SupplierModel.findById(_id);
      if (!supplier) {
        return res.status(404).json({ msg: "Supplier not found" });
      }

      Object.assign(supplier, object);
      const result = await supplier.save();

      if (result) {
        const formattedDate = getFormattedDate();
        const fileName = `PREREF_Y2_FOURN_${formattedDate}.csv`;
        
        const rddMapping = {
          code: "code",
          company_name: "company_name",
          siret: "siret",
          tva: "tva",
          customer_ref: "customerref",
          web_url: "web_url",
          email: "email",
          phone: "phone",
          trade_name: "trade_name",
          address1: "address1",
          address2: "address2",
          address3: "address3",
          postal: "postal",
          city: "city",
          country: "country",
          comment: "comment",
          tarif: "tarif",
          currency: "currency",
          status: "status"
        };

        const csvFilePath = await exportToCSV(
          supplier.toObject(),
          fileName,
          Object.keys(rddMapping)
        );

        res.status(OK).json({
          msg: "Supplier updated successfully",
          csvFilePath,
        });
      } else {
        throw new Error("Failed to save the object");
      }
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json({});
    }
  }
);

export default router;