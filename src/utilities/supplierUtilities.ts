import { Document } from "mongodb";
import { Request } from "express";
import SupplierSchema from "../schemas/supplierSchema";

export const supplierGetBasedOnParam = async ( req: Request, param: any, collectionKey: string): Promise<Document[]>  => {
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
        intLimit = 1000;        
    } else {
        intLimit = parseInt(limit); 
    }        

    const skip = (intPage - 1) * intLimit;

    return await SupplierSchema.find({ [collectionKey]: param }).skip(skip).limit(intLimit);

}
