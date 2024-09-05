import express, { Request, Response } from "express"
import { EVENT } from "./shared";
import EventModel, { Event } from "../../schemas/eventSchema";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { OK } from "../../codes/success";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

router.get(EVENT + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {

        const {intLimit, skip} = await generalLimits(req);


        let filter: any = { $and: [] }  // any to make typescript stop complaining
        
        const label = req.query.label;

        if(label) {
            const regEx = new RegExp(label as string, "i");

            filter.$and.push({ label: regEx })
        }

        const code = req.query.code;

        if(code) {
            const regEx = new RegExp(code as string, "i");

            filter.$and.push({ code: regEx })
        }

        const type = req.query.type;

        if(type) {
            const regEx = new RegExp(type as string, "i");

            filter.$and.push({ type: regEx })
        }


        if(!label && !code && !type) {
            throw new Error(req.originalUrl + ", msg: code, label and type were falsy. Probably means code, label and type were undefined")
        }

        const data  = await EventModel.find(filter).skip(skip).limit(intLimit)
        
        const total = await EventModel.countDocuments(filter);

        res.status(OK).send({ data , total})

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})


router.get(EVENT, authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const {skip, intLimit} = await generalLimits(req);

        const data: Event[] | null | undefined = await EventModel.find().sort({ timestamp: -1 }).skip(skip).limit(intLimit)

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await EventModel.countDocuments({});

        res.status(OK).json({ data, total})
        
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})

router.get(EVENT + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        const data: Event | null | undefined = await EventModel.findById(id)


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