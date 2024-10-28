import express, { Request, Response } from "express"
import { DIMENSION_GRID } from "./shared";
import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import DimensionGridModel, { DimensionGrid} from "../../schemas/dimensionGridSchema";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();


router.post(DIMENSION_GRID, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const object = req.body;
        
        if(!object) {
            throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
        }

        const {code} = object;
        
        const doesExist : Document | null | undefined = await DimensionGridModel.findOne({ code });

        if(doesExist) throw new Error("Une collection avec le code suivant existe déjà: " + code);

        const newObject: DimensionGrid | null | undefined = await new DimensionGridModel({...object});

        if(!newObject) {
            throw new Error(req.originalUrl + " msg: dimension save did not work for some reason: " + object);
        }

        const result: DimensionGrid | null | undefined = await newObject.save({timestamps: true});

        res.status(OK).json(result)

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


export default router;