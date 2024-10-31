import express, { Request, Response } from "express"
import { TAG } from "./shared"
import { INTERNAL_SERVER_ERROR } from "../../codes/errors"
import { generalLimits } from "../../services/generalServices"
import TagModel, { Tag } from "../../schemas/tagSchema"
import { OK } from "../../codes/success"
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear"

const router = express.Router()


router.get(TAG + "/search", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
        const { intLimit, skip } = await generalLimits(req);
        let filter: any = { $and: [] };

        const code = req.query.code;
        const name = req.query.name;
        const level = req.query.level;
        const status = req.query.status;

        // Créez une condition $or pour `code` et `name`
        const orConditions = [];
        if (code) {
            const regExCode = new RegExp(code as string, "i");
            orConditions.push({ code: regExCode });
        }

        if (name) {
            const regExName = new RegExp(name as string, "i");
            orConditions.push({ name: regExName });
        }

        if (orConditions.length > 0) {
            filter.$and.push({ $or: orConditions });
        }

        if (level) {
            const regExLevel = new RegExp(level as string, "i");
            filter.$and.push({ level: regExLevel });
        }

        if (status) {
            filter.$and.push({ status });
        }

        // Vérifiez s'il y a des conditions, sinon renvoyez une erreur
        if (filter.$and.length === 0) {
            throw new Error(
                req.originalUrl +
                ", msg: All of the parameters were falsy. Probably means they were undefined"
            );
        }

        const data = await TagModel.find(filter).lean().skip(skip).limit(intLimit);

        if (!data) {
            throw new Error(req.originalUrl + ", msg: find error");
        }

        const total = await TagModel.countDocuments(filter);

        res.status(OK).json({ data, total });
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err);
    }
});


router.get(TAG, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {
        const {intLimit, skip} = await generalLimits(req);

        const data: Tag[] | null | undefined = await TagModel.find().sort({ creation_date: -1 }).skip(skip).limit(intLimit).populate("tag_grouping_id")

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const total = await TagModel.countDocuments({});

        res.status(OK).json({ data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})


router.get(TAG + "/field/:field/value/:value", async (req: Request, res: Response) => {
    try {
        const { value , field } = req.params;

        const data : Tag[] | null | undefined = await TagModel.find({[field] : value}); // we find all in case the edge case of different level families with same name
    
        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }
        
        res.status(OK).json(data);
    }
    catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }

})

router.get(TAG + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const document: Tag | null | undefined = await TagModel.findById(id).populate("tag_grouping_id");

        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: Document was null or undefined");
            return;
        }

        res.status(OK).json(document)

    }
    catch(err) {
        console.error(err)
    }


})


export default router