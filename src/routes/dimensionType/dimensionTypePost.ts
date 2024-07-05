// DEPRECATED
// import express, { Request, Response } from "express"
// import { DIMENSION_TYPE } from "./shared";
// import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
// import { OK } from "../../codes/success";
// import { Document } from "mongoose";
// import DimensionTypeModel from "../../schemas/dimensionTypeSchema";
// import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

// const router = express.Router();


// router.post(DIMENSION_TYPE, authorizationMiddlewear, async (req: Request, res: Response) => {
//     try {
//         const object = req.body;
        
//         if(!object) {
//             throw new Error(req.originalUrl + ", msg: object was falsy: " + object)
//         }

//         const newObject: Document | null | undefined = await new DimensionTypeModel({...object});

//         if(!newObject) {
//             throw new Error(req.originalUrl + " msg: object create did not work for some reason: " + object);
//         }

//         const result: Document | null | undefined = await newObject.save({timestamps: true});

//         res.status(OK).json(result)

//     } catch(err) {
//         console.error(err);
//         res.status(INTERNAL_SERVER_ERROR).json(err)
//     }
// })


// export default router;