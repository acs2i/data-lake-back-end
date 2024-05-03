import express, { Request, Response } from "express"
import { FAMILY } from "./shared";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import FamilyModel from "../../schemas/familySchema";
import { OK } from "../../codes/success";
import { Document } from "mongoose";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

router.get(FAMILY, authorizationMiddlewear, async( req: Request, res: Response) => {
    try {

        const {skip, intLimit} = await generalLimits(req);

        const documents: Document[] | null | undefined = await FamilyModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

       
        const total = await FamilyModel.countDocuments({});

        res.status(OK).json({ data: [...documents], total})


    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})
router.get(FAMILY + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {

        const {intLimit} = await generalLimits(req);


        let filter: any = { $and: [] }  // any to make typescript stop complaining

        const YX_CODE = req.query.YX_CODE;

        if(YX_CODE) {
            const regEx = new RegExp(YX_CODE as string, "i");
            filter.$and.push({ YX_CODE: regEx })
        }

        const YX_TYPE = req.query.YX_TYPE;

        if(YX_TYPE) {
            const regEx = new RegExp(YX_TYPE as string, "i");
            filter.$and.push({ YX_TYPE: regEx })
        }
        
        const YX_LIBELLE = req.query.YX_LIBELLE;

        if(YX_LIBELLE) {
            const regEx = new RegExp(YX_LIBELLE as string, "i");
            filter.$and.push({ YX_LIBELLE: regEx })
        }

        if(!YX_CODE && !YX_LIBELLE && !YX_TYPE) {
            throw new Error(req.originalUrl + ", msg: All of the parameters were falsy. Probably means they were undefined")
        }


        const data  = await FamilyModel.find(filter).limit(intLimit);
        const total = await FamilyModel.countDocuments(filter);
       

        res.status(OK).send({ data , total})

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})




/* GET BY YX_TYPE */
// GOING TO DEPRCATE IT SINCE VALUE ISNT IN THE  QUERY AND IS IN PARAM
router.get(FAMILY + "/YX_TYPE", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const YX_TYPE = req.query.YX_TYPE;

        if(YX_TYPE === null || YX_TYPE === undefined) {
            throw new Error(req.originalUrl + ", msg: YX_TYPE was: " + YX_TYPE)
        }

        const {skip, intLimit} = await generalLimits(req)

        let documents: Document[] | null | undefined
        let total 
        const value = req.query.value;

        if(value) {
            const regEx = new RegExp(value as string, "i");
            const filter = { $and: [{ YX_TYPE : YX_TYPE as string}, { YX_LIBELLE: { $regex: regEx } } ] }
            documents = await FamilyModel.find(filter).skip(skip).limit(intLimit);
            total = await FamilyModel.countDocuments(filter);

        } else {
            const filter = {YX_TYPE: YX_TYPE as string}
            documents = await FamilyModel.find(filter).skip(skip).limit(intLimit);
            total = await FamilyModel.countDocuments(filter);

        }


        if ( documents === null ||  documents === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: documents was null or undefined");
            return;
        }
        

        res.status(OK).json({ data: [...documents], total})

    }
    catch(err) {
        res.status(BAD_REQUEST).json(err)
        console.error(err)
    }


})


router.get(FAMILY + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Document | null | undefined = await FamilyModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: Document was null or undefined");
            return;
        }

        res.status(OK).json(document)

    }
    catch(err) {
        res.status(BAD_REQUEST).json(err)
        console.error(err)
    }


})





export default router;