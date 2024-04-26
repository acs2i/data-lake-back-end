import express, { Request, Response } from "express"
import { FAMILY } from "./shared";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import FamilyModel from "../../schemas/familySchema";
import { OK } from "../../codes/success";
import { Document } from "mongoose";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

const router = express.Router();

router.get(FAMILY, authorizationMiddlewear, async( req: Request, res: Response) => {
    try {
        const page: string | any | string[] | undefined = req.query.page;
        const limit: string | any | string[] | undefined = req.query.limit;

        let intPage;
        let intLimit;

        if(page === undefined) {
            intPage = 1;
        } else {
            intPage = parseInt(page) 
        }


        if(limit === undefined) {
            intLimit = 10;        
        } else {
            intLimit = parseInt(limit); 
        }        

        const skip = (intPage - 1) * intLimit;

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
        const page: string | any | string[] | undefined = req.query.page;
        const limit: string | any | string[] | undefined = req.query.limit;

        let intPage;
        let intLimit;

        if(page === undefined) {
            intPage = 1;
        } else {
            intPage = parseInt(page) 
        }


        if(limit === undefined) {
            intLimit = 10;        
        } else {
            intLimit = parseInt(limit); 
        }        

        const value = req.query.value;


        if(!value) {
            throw new Error(req.originalUrl + ", msg: value in family routes get was falsy: " + value);
        } 


        // If the value CANNOT be converted into a number, this means that it must be a string. Therefore, it is searching in Libelle 
        // if it can be converted into a number, that means it must be a code. and we search in that bar
        let documents: Document[] | null | undefined;

        if(isNaN(Number(value))) {
            // if it is not a number, then search in libelle
            documents  = await FamilyModel.find({ YX_LIBELLE: { $regex: value as string } }).limit(intLimit);

        } else {
            // need to discuss to convert yx_code into string
            documents = await FamilyModel.find({ YX_CODE: { $regex: value as string} }).limit(intLimit);

        }


        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        res.status(OK).send(documents)
        // res.status(OK).json(documents)
    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})




/* GET BY YX_TYPE */

router.get(FAMILY + "/YX_TYPE/:YX_TYPE", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const YX_TYPE: string | undefined | null = req.params.YX_TYPE;

        if(YX_TYPE === null || YX_TYPE === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: YX_TYPE was: " + YX_TYPE)
        }

        const page: string | any | string[] | undefined = req.query.page;
        const limit: string | any | string[] | undefined = req.query.limit;

        let intPage;
        let intLimit;

        if(page === undefined) {
            intPage = 1;
        } else {
            intPage = parseInt(page) 
        }


        if(limit === undefined) {
            intLimit = 10;        
        } else {
            intLimit = parseInt(limit); 
        }        

        const skip = (intPage - 1) * intLimit;

        const documents: Document[] | null | undefined = await FamilyModel.find({YX_TYPE}).skip(skip).limit(intLimit);


        if ( documents === null ||  documents === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: documents was null or undefined");
            return;
        }
        
        const total = await FamilyModel.countDocuments({YX_TYPE});

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