// DEPRECATED
// import { DIMENSION_TYPE } from "./shared";
// import express, { Request, Response } from "express"
// // import DimensionTypeModel from "../../schemas/dimensionTypeSchema";
// import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
// import { Document } from "mongoose";
// import { OK } from "../../codes/success";
// import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
// import { generalLimits } from "../../services/generalServices";

// const router = express.Router();

// router.get(DIMENSION_TYPE, authorizationMiddlewear, async (req: Request, res: Response) => {
//     try {

//         const {skip, intLimit} = await generalLimits(req);

//         const documents: Document[] | null | undefined = await DimensionTypeModel.find().skip(skip).limit(intLimit);

//         if ( documents === null ||  documents === undefined) {
//             throw new Error(req.originalUrl + ", msg: find error")
//         }


//         const total = await DimensionTypeModel.countDocuments({});

//         res.status(OK).json({ data: [...documents], total})
        
//     } catch(err) {
//         console.error(err)
//         res.status(INTERNAL_SERVER_ERROR).json(err)
//     }
// })

// export default router;