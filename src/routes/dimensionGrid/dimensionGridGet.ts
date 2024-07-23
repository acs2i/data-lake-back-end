import express, { Request, Response } from "express"
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";
import { DIMENSION_GRID } from "./shared";
import DimensionGridModel, { DimensionGrid} from "../../schemas/dimensionGridSchema";

const router = express.Router();


router.get(DIMENSION_GRID, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const {skip, intLimit} = await generalLimits(req);

        const data: DimensionGrid[] | null | undefined = await DimensionGridModel.find().sort({ createdAt: -1 }).skip(skip).limit(intLimit);

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await DimensionGridModel.countDocuments({});

        res.status(OK).json({ data, total})
        
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})

router.get(DIMENSION_GRID + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const data: DimensionGrid | null | undefined = await DimensionGridModel.findById(id);


        if ( data === null ||  data === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: data was null or undefined");
            return;
        }

        res.status(OK).json(data)

    }
    catch(err) {
        res.status(BAD_REQUEST).json(err)
        console.error(err)
    }


})


export default router;