import express, { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../codes/errors";
import BrandModel from "../schemas/brandSchema";
import { OK } from "../codes/success";
const path = "/brand"
const router = express.Router();

router.get(path, async (req: Request, res: Response) => {
    try {
        const brands = await BrandModel.find();

        if(brands === undefined || brands === null) {
            throw new Error("brands could not be fetched for some reason")
        }
        
        res.status(OK).json(brands)

    } catch(error) {
        console.error(error)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

router.post(path, async ( req: Request, res: Response) => {

    try {

        const name = req.body.name;

        if(name === undefined || name === null) {
            throw new Error("name was undefined for some reason")
        }

        const creator = req.body.creator;

        if(creator === undefined || creator === null) {
            throw new Error("creeator was undefinedfor some reason")
        }

        const newBrand = new BrandModel({creator, name})


        const response = await newBrand.save();

        if(!response) {
            throw new Error("new brand was not saved for some reason")
        }

        res.status(OK).json(response);

    } catch(error) {
        console.error(error)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }

})
 
router.delete(path + "/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;    

        if(id === undefined || id === null) {
            throw new Error("id could not be fetched for some reason")
        }

        const result = await BrandModel.deleteOne({ _id: id});
        
        res.status(OK).json(result)

    } catch(error) {
        console.error(error)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
})

export default router;