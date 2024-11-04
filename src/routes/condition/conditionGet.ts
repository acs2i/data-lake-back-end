import express, { Request, Response } from "express";
import { CONDITION } from "./shared";
import ConditionModel, { Condition } from "../../schemas/conditionsSchema";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();

router.get(CONDITION + "/:supplierId", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const supplierId: string | undefined = req.params.supplierId;

        if (!supplierId) {
            return res.status(BAD_REQUEST).json({ message: "Invalid supplier ID" });
        }

        // Rechercher toutes les conditions qui ont `supplier_id` égal à l'id fourni
        const conditions: Condition[] = await ConditionModel.find({ supplier_id: supplierId }).populate("brand_id");

        if (conditions.length === 0) {
            return res.status(OK).json({ message: "No conditions found for this supplier" });
        }

        res.status(OK).json(conditions);
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "An error occurred", error: err });
    }
});

export default router;
