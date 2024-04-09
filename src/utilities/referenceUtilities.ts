import PriceModel, { Price } from "../schemas/priceSchema";
import { Document, ObjectId } from "mongodb";
import { ResultReference } from "../interfaces/resultInterfaces";


export const fetchPriceModel = async (documents: Document | Document[]) : Promise<ResultReference[]> => {

    if( !Array.isArray(documents) ) {
        documents = [documents];
    }

    const docs: Document[] = documents as Document[]; // This makes typescript stop complaining, lol

    const results: ResultReference[] = []

    for(let i = 0; i < documents.length; i++) {
           
        const document: Document = docs[i];
       
        const priceObjects: Document[]= [];
       
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

        // End of loop for specific object in the documents array, lets now push it into the result array
        const result: ResultReference = { _id: document._id, colors: document.colors, sizes: document.size, prices: priceObjects }

        results.push(result);
    }
    
    return results;


}