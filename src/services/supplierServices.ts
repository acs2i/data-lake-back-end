import { Document } from "mongodb";
import { Request } from "express";
import SupplierModel from "../schemas/supplierSchema";
import { UpdateWriteOpResult } from "mongoose";

export const supplierreferenceGetOnParam = async ( req: Request, param: any, collectionKey: string): Promise<Document[]>  => {
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

    return await SupplierModel.find({ [collectionKey]: param }).skip(skip).limit(intLimit);

}


export const supplierPatchOnParam = async (filterKey: string, filterValue: string, updateKey: string, updateValue: string) : Promise<UpdateWriteOpResult> => {
    const filter = { [filterKey] : filterValue };
    const update   = { $set: { [updateKey]: updateValue} };
    return await SupplierModel.updateOne(filter,update);
}