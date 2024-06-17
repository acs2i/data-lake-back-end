// DEPRECATED
// import express, { Request, Response } from "express"
// import { GRID } from "./shared";
// import DimensionGridModel from "../../schemas/dimensionGridSchema";
// import { generalLimits } from "../../services/generalServices";
// import { Document } from "mongoose";
// import { OK } from "../../codes/success";
// import { INTERNAL_SERVER_ERROR } from "../../codes/errors";
// import authorizationMiddlewear from '../../middlewears/applicationMiddlewear';

// const router = express.Router();

// router.get(GRID, authorizationMiddlewear, async (req: Request, res: Response) => {

//     try {

//         const {skip, intLimit} = await generalLimits(req);

//         const documents: Document[] | null | undefined = await DimensionGridModel.find().skip(skip).limit(intLimit);

//         if ( documents === null ||  documents === undefined) {
//             throw new Error(req.originalUrl + ", msg: find error")
//         }

       
//         const total = await DimensionGridModel.countDocuments({});

//         res.status(OK).json({ data: [...documents], total})


//     } catch(err) {
//         console.error(err);
//         res.status(INTERNAL_SERVER_ERROR).json(err)
//     }

// })

// router.get(GRID + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {

//     try {

//         const id = req.params.id;

//         if(!id) {
//             throw new Error(req.originalUrl + ", msg: id was falsy: " + id);
//         }

//         const data: Document | null | undefined = await DimensionGridModel.findById(id);

//         if ( data === null ||  data === undefined) {
//             throw new Error(req.originalUrl + ", msg: find error")
//         }


//         res.status(OK).json(data)


//     } catch(err) {
//         console.error(err);
//         res.status(INTERNAL_SERVER_ERROR).json(err)
//     }

// })


// export default router;