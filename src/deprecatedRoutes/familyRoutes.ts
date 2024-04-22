import express, { Request, Response } from "express";
import FamilyModel, { Family } from "../schemas/familySchema";
import { INTERNAL_SERVER_ERROR } from "../codes/errors";
import { OK } from "../codes/success";
import { Document, Model } from "mongoose";
const router = express.Router();
const path = "/family"

router.get(path, async (req: Request, res: Response) => {
    try {
      const families: Document[]| null | undefined = await FamilyModel.find().sort({name: -1}).populate('subFamily');
  
      if(families === undefined || families === null) {
        throw new Error("Families could not be fetched for some reason")
      }

      res.status(OK).json( families );
  
    } catch (err) {
      console.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({})
    }
});


router.get(path + "/name/:name", async(req: Request, res: Response) => {
    try {

      const name : string | null | undefined = req.params.name;

      if(name === undefined || name === null) {
        throw new Error(req.originalUrl + ": msg: name was undefind or null: " + name);
      }

      const family : Document | undefined | null = await FamilyModel.findOne({name});

      res.status(OK).json(family);

    } catch(err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json({})
    }
})


router.post(path, async (req: Request, res: Response) => {

    try {

        const { name, subFamily, creatorId } = req.body;


        // if(name === undefined || name === null) {
        //     throw new Error("Name was null or undefined in family routes")
        // }

        // if(subFamily === undefined || subFamily === null) {
        //     throw new Error("subFamily was null or undefined in family routes")
        // }

        if(creatorId === undefined || creatorId === null) {
            throw new Error("creatorId was null or undefined in family routes")
        }
        // Créer un nouveau produit avec les détails de l'utilisateur
        const newFamily = new FamilyModel({
            name,
            subFamily,
            creatorId
        });

        // Enregistre le produit
        const savedFamily = await newFamily.save({timestamps: true});

        res.status(OK).json(savedFamily);
    } catch (err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }
  }
);



export default router;