import express, { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../codes/errors";
import SubFamilyModel from "../schemas/subFamilySchema";
import { OK } from "../codes/success";
import FamilyModel, { Family } from "../schemas/familySchema";
import { Document } from "mongoose";
import { ObjectId } from "mongodb";


const router = express.Router();
const path = "/subFamily"

// gets all the sub families with a family id
router.get(path + "/:familyId", async( req: Request, res: Response) => {
    
    try {
        const familyId: string | undefined | null = req.params.familyId;
        
        if(familyId === undefined || familyId === null) {
            throw new Error("familyId was null or undefined in subFamily GET :familyId route")
        }

        const subFamilies = await SubFamilyModel.find({ familyId });

        if(subFamilies.length === 0) {
            console.warn("all child sub famillies length was 0, here is the array: " , subFamilies)
            console.warn("Here is the family id: " , familyId)
        }

        res.status(OK).json(subFamilies)
    
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json({})
    }


    

})




router.post(path, async ( req: Request, res: Response) => {

    try {
        const name : string | null | undefined = req.body.name;
    
        if(name === undefined || name === null) {
            throw new Error("Name was null or undefined in subFamily routes")
        }

        const familyId : string | null | undefined = req.body.familyId;

        console.log("FAMILY: " , req.body)

        if(familyId === undefined || familyId === null) {
            throw new Error("familyId was null or undefined in subfamily routes")
        }

        // console.log("name", name)
        // console.log("family ", family )
        const newSubFamily = new SubFamilyModel({ name, familyId});

        const savedSubFamily = await newSubFamily.save({ timestamps: true});

        if(!savedSubFamily) {
            throw new Error("Issue with saving the subfamily");
        } 

        const familyDocument:  any | null | undefined  = await FamilyModel.findById(familyId);

        const { _id }  = savedSubFamily;

        if(familyDocument === null || familyDocument === undefined) {
            // Undo the sub family save
            SubFamilyModel.deleteOne({ _id });
            throw new Error("Family document is not found")
        }

        familyDocument.subFamily.push(_id);

        const savedFamily = await familyDocument.save();

        if(!savedFamily) {
            SubFamilyModel.deleteOne({ _id });
            throw new Error("Issue with saving the family");
        }

        res.status(OK).json(savedSubFamily);

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({})
    }

})

export default router;