import express, { Request, Response } from "express"
import { DIMENSION } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";

const router = express.Router();

// we will need to be a
router.post(DIMENSION, async (req: Request, res: Response) => {
    try {
        

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;