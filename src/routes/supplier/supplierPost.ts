import express, { Request, Response } from "express";
import { SUPPLIER } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import { Document } from "mongoose";
import SupplierModel, { Supplier } from "../../schemas/supplierSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { exportToCSV } from "../../services/csvExportUtil";
import { getFormattedDate } from "../../services/formatDate";

const router = express.Router();

router.get(SUPPLIER + "/field/:field/id/:id", async (req: Request, res: Response) => {
    try {
        const { value, field } = req.params;

        const data: Supplier[] | null | undefined = await SupplierModel.findOne({ [field]: value });
    
        if (!data) {
            throw new Error(req.originalUrl + ", msg: find error");
        }
        
        res.status(OK).json(data);
    }
    catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({});
    }
});

router.post(SUPPLIER, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const object = req.body;
        
        if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object);
        }

        const newObject: Document | null | undefined = await new SupplierModel({...object});

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: object create did not work for some reason: " + object);
        }

        const result: Document | null | undefined = await newObject.save({timestamps: true});

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
                newObject.toObject(),
                fileName,
                Object.keys(rddMapping)
            );

            res.status(OK).json({ result, csvFilePath });
        } else {
            throw new Error("Failed to save the object");
        }

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err);
    }
});

export default router;