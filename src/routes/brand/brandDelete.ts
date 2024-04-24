import express, { Request, Response } from "express"
import { BRAND } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import BrandModel from "../../schemas/brandSchema";
import { OK } from "../../codes/success";

const router = express.Router();

router.delete(BRAND + "/:id", async (req: Request, res: Response) => {

    try {

        const id = req.params.id;

        if(!id) {
            throw new Error(req.originalUrl + ", msg: id was falsy: " + id);
        }

        const response = await BrandModel.deleteOne({ _id: id })

        if(response.deletedCount === 0) {
            res.status(INTERNAL_SERVER_ERROR).json({ msg: "Brand not found"});
        } else {
            res.status(OK).json(response);
        }


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})

export default router;