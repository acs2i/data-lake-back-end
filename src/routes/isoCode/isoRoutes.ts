import express, { Request, Response } from 'express';
import { Router } from 'express';
import { generalLimits } from '../../services/generalServices';
import IsoModel, { IsoSchema } from '../../schemas/isoSchema';
import { OK } from '../../codes/success';
import { INTERNAL_SERVER_ERROR } from '../../codes/errors';

const router: Router = express.Router();

router.get("/iso", async(req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        const data: IsoSchema[] | null | undefined = await IsoModel.find().skip(skip).limit(intLimit)

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await IsoModel.countDocuments({});

        res.status(OK).json({ data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})


export default router;
