import PriceModel from "../schemas/priceSchema";
import { Document, ObjectId } from "mongodb";
import { ResultReference } from "../interfaces/resultInterfaces";
import { Request } from "express";
import ReferenceModel from "../schemas/referenceSchema";
import { UpdateWriteOpResult } from "mongoose";
import ReferenceHistoryModel from "../schemas/referenceHistorySchema";

export const referenceGetOnParam = async ( req: Request, param: any, collectionKey: string): Promise<Document[]>  => {
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

    return await ReferenceModel.find({ [collectionKey]: param }).skip(skip).limit(intLimit);

}

export const referenceGetPriceDocument = async (documents: Document | Document[]) : Promise<ResultReference[]> => {

    if( !Array.isArray(documents) ) {
        documents = [documents];
    }

    const docs: Document[] = documents as Document[]; // This makes typescript stop complaining, lol

    const results: ResultReference[] = []

    for(let i = 0; i < documents.length; i++) {
           
        const document: Document = docs[i];
       
        const priceObjects: Document[]= [];
       
        if(document.priceId) {
            // Loop through to get all the ACTUAL price documents and then put it into the priceId
            for(let j = 0; j < document.priceId.length; j++) {
                
                const priceId: string = document.priceId[j];        // it should be the object but since populate has a bug its a tring
                
                const objId = new ObjectId(priceId);
                
                const obj : Document | null | undefined = await PriceModel.findById(objId)
                
                    
                if ( obj === null ||  obj === undefined) {
                    continue;
                }

                priceObjects.push(obj as Document);

            }

        }
   
        // End of loop for specific object in the documents array, lets now push it into the result array
        const result: ResultReference = { _id: document._id, colors: document.colors, sizes: document.size, prices: priceObjects, k: document.k, v: document.v, history: document.history }

        results.push(result);
    }
    
    return results;


}

export const referencePostRefHistory = async (document: Document[] | Document) : Promise<Error | Document[]> => {

    try { 

        const result = [];

        if(Array.isArray(document)) {
            for(let i = 0; i < document.length; i++) {
  
                const {k,v,family,colors, frnPrincipal, size, priceId, version, _id} = document[i];

                if(_id === undefined || _id === null) {
                    throw new Error("referencePostRefHistory, _id was " + _id + " and array document was: " + document);
                }
        
                const refHistory = new ReferenceHistoryModel({
                    reference: { k,v, family, colors, frnPrincipal, size, priceId, version },
                    newestVersionId: _id
                })
                       
                const res: Document = await refHistory.save({ timestamps: true});

                result.push(res);
            }
        } else {

            const {k,v,family,colors, frnPrincipal, size, priceId, version, _id} = document;

            if(_id === undefined || _id === null) {
                throw new Error("referencePostRefHistory, _id was " + _id  + " and document was: " + document);
            }
    
            const refHistory = new ReferenceHistoryModel({
                reference: { k,v, family, colors, frnPrincipal, size, priceId, version },
                newestVersionId: _id
            })
    
            const res: Document = await refHistory.save({ timestamps: true});

            result.push(res);
        }

        return result;

    }
    catch(err: unknown) {
        return err as Error;
    }
   
    
}

export const referenceDeleteRefHistory = async ( postedRefHistory: Document[] ) : Promise<Document[]> => {

    const result = [];
    for(let i = 0; i < postedRefHistory.length; i++) {
        const {_id} = postedRefHistory[i];

        const res = await ReferenceHistoryModel.deleteOne({_id});
        result.push(res)
    }

    return result;
}

export const referencePatchOnParam = async (filterKey: string, filterValue: string, updateKey: string, updateValue: string) : Promise<UpdateWriteOpResult> => {
    const filter = { [filterKey] : filterValue };
    const update   = { $set: { [updateKey]: updateValue}, $inc: { version: 1} };
    return await ReferenceModel.updateOne(filter,update);
}
// example   filterKey: _id, filterValue: 12345, updateKey: family: updateValue: Backpack
export const referenceCompletePatch = async (req: Request, filterKey: string, filterValue: string, updateKey: string, updateValue: any ): Promise<UpdateWriteOpResult | Error >=> {
    
        const path = req.originalUrl;
        // Push old version to reference history table first
        const oldVersion: Document | undefined | null = await referenceGetOnParam(req, filterValue, filterKey);

        
        if(oldVersion === null || oldVersion === undefined) {
            return new Error(path + "/reference/k/:id, msg: currentVersion ( soon to be old ) not able to be found: " + filterKey)
        }

        // Error possibility is handled in this function
        const postedRefHistory: Document[] | Error = await referencePostRefHistory(oldVersion);

        if(postedRefHistory instanceof Error) {
            return postedRefHistory;
        }

        // if unable to post history for some odd reason
        if(postedRefHistory.length === 0) {
            return new Error(path + "/reference/k/:id, msg: received an empty array from referencepostrefhistory function with this id in url: " + filterKey)
        }

        const response: UpdateWriteOpResult = await referencePatchOnParam(filterKey, filterValue, updateKey, updateValue);

        if(response.acknowledged && response.matchedCount === 1 && response.modifiedCount === 1) {
            return response
        } else {
            // Undo newly created version then. No await, client doesn't need to wait for this action to be completed.
            referenceDeleteRefHistory(postedRefHistory).then((res: Document[]) => console.error("Reference delete history result: " , res));

            return new Error(path + "/k/:id, msg: issue with writing operation. Id was : " + filterKey + " and k was : " + updateKey)
        }

}