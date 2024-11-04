import express, { Request, Response } from "express";
import { CONDITION } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import ConditionModel, { Condition } from "../../schemas/conditionsSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();

router.post(CONDITION, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const conditionData = req.body;

        if (!conditionData) {
            throw new Error(req.originalUrl + ", msg: condition data was falsy: " + JSON.stringify(conditionData));
        }

        const newCondition: Condition = new ConditionModel({ ...conditionData });

        const savedCondition: Condition = await newCondition.save({ timestamps: true });

        res.status(OK).json(savedCondition);

    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({ message: "An error occurred", error: err });
    }
});

export default router;
