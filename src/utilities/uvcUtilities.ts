import { Document, ObjectId } from "mongodb";
import { UVC } from "../interfaces/resultInterfaces";
import PriceModel from "../schemas/priceSchema";
import { Request } from "express";
import UVCModel from "../schemas/uvcSchema";

export const uvcGetBasedOnParam = async ( req: Request, param: any, collectionKey: string): Promise<Document[]>  => {
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

    return await UVCModel.find({ [collectionKey]: param }).skip(skip).limit(intLimit);

}


export const uvcFetchPriceModel = async (documents: Document | Document[]) : Promise<UVC[]> => {

    if( !Array.isArray(documents) ) {
        documents = [documents];
    }

    const docs: Document[] = documents as Document[]; // This makes typescript stop complaining, lol

    const results: UVC[] = []

    for(let i = 0; i < documents.length; i++) {
           
        const document: Document = docs[i];
       
        const priceObjects: Document[]= [];
       
        if(document.prices && document.prices.length > 0) {
        // Loop through to get all the ACTUAL price documents and then put it into the priceId
            for(let j = 0; j < document.prices.length; j++) {
                
                const priceId: string = document.prices[j].priceId;        // it should be the object but since populate has a bug its a tring
                
                if(priceId) {
                    const objId = new ObjectId(priceId);
                
                    const obj : Document | null | undefined = await PriceModel.findById(objId)
                    
                        
                    if ( obj === null ||  obj === undefined) {
                        continue;
                    }
    
                    priceObjects.push(obj as Document);    
                } else continue;
        
            }
        }


        // End of loop for specific object in the documents array, lets now push it into the result array
        const result: UVC = { 
            _id: document._id, 
            color: document.colors, 
            size: document.size, 
            prices: priceObjects, 
            k: document.k,  
            eans: document.eans, 
            images: document.images, 
            uvcs: document.uvcs
        }

        results.push(result);
    }
    
    return results;


}