import express, { Request, Response } from "express"
import { INTERNAL_SERVER_ERROR } from "../codes/errors";
import { OK } from "../codes/success";
import CollectionModel from "../schemas/collectionSchema";

const router = express.Router();
const path = "/collection"

router.get(path, async ( req: Request, res: Response) => {
    try {
        const collections = await CollectionModel.find();

        if(collections === undefined || collections === null) {
            throw new Error("collections could not be fetched for some reason")
        }
        
        res.status(OK).json(collections)
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})


router.post(path, async ( req: Request, res: Response) => {
    try {

        const name = req.body.name;

        
        if(name === undefined || name === null) {
            throw new Error(req.originalUrl + " name was undefined for some reason")
        }


        const creatorId = req.body.creatorId;

        
        if(creatorId === undefined || creatorId === null) {
            throw new Error(req.originalUrl + " name was undefined for some reason")
        }

        const newCollection = new CollectionModel({name, creatorId});

        const response = await newCollection.save();

        
        if(!response) {
            throw new Error("new collection was not saved for some reason")
        }

        console.log("HERE", response )

        res.status(OK).json(response);


    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

 
router.delete(path + "/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;    

        if(id === undefined || id === null) {
            throw new Error("id could not be fetched for some reason")
        }

        const result = await CollectionModel.deleteOne({ _id: id});
        
        res.status(OK).json(result)

    } catch(error) {
        console.error(error)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})


export default router;