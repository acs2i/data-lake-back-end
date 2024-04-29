import { PopulatedProduct, Product } from "../schemas/productSchema";
import UvcModel, { Uvc } from "../schemas/uvcSchema";
import FamilyModel, { Family } from "../schemas/familySchema";
import BrandModel, { Brand } from "../schemas/brandSchema";


/*
    Contains the business logic/the manner that the server should interact with the db
*/



/** 
 * There is a decision i can make here related to the GET request at /product
 * 
 * 1. I call the get family as well in the for loop, which would more efficient than making another function call
 * 2. I do another function call, to leave the functions decoupled.
 * 
 * I think for the principle of code reusability, I should leave things decoupled (option 2). Perhaps this will lead to benefits of scaling later. 
*/


export const productPopulateUvc = async ( documents : Product | Product[]) : Promise<PopulatedProduct[]> => {

    if(!Array.isArray(documents)) {
        documents = [documents]
    }
    const data = [];

    for (const document of documents) {
        const { GA_CODEARTICLE, _id } = document;

        const uvcs: Uvc[] | undefined | null = await UvcModel.find({GA_CODEARTICLE});

        // if uvc, then add the uvc into the document
        if(uvcs) {

            const {  
                GA_CODEARTICLE,     
                GA_LIBCOMPL,      
                GA_LIBELLE,    
                GA_LIBREART1,   // linked to the familly collection
                GA_LIBREART2,   // linked to sous famile in the family collection
                GA_LIBREART4,   // linked to brand collection
                GA_FOURNPRINC, 
                GA_FERME,      
                GA_VERSION,
                GA_HISTORIQUE,
                family,
                subFamily, 
                _id,
                brand,
            } = document as PopulatedProduct;

    

            const product = {  
                GA_CODEARTICLE,     
                GA_LIBCOMPL,      
                GA_LIBELLE,    
                GA_LIBREART1,  
                GA_LIBREART2, 
                GA_LIBREART4, 
                GA_FOURNPRINC, 
                GA_FERME,      
                GA_VERSION,
                GA_HISTORIQUE, 
                uvcs, 
                family,
                subFamily,
                brand,
                _id
            } as PopulatedProduct

            data.push(product)

        }

    }

    return data;
}

export const productPopulateFamily = async( documents: Product | Product[]): Promise<PopulatedProduct[]> => {
    if(!Array.isArray(documents)) {
        documents = [documents]
    }
    const data: PopulatedProduct[] = [];

    for (const document of documents) {

        const {  
            GA_CODEARTICLE,     
            GA_LIBCOMPL,      
            GA_LIBELLE,    
            GA_LIBREART1,   // linked to the familly collection
            GA_LIBREART2,   // linked to sous famile in the family collection
            GA_LIBREART4,   // linked to brand collection
            GA_FOURNPRINC, 
            GA_FERME,      
            GA_VERSION,
            GA_HISTORIQUE,
            _id,
            uvcs,
            brand,
        } = document as PopulatedProduct;

        let product= {};
        // if ga libreart1 is not undefined, lets see if there are any values in family collection for it
        if(GA_LIBREART1) {
            const family: Family | undefined | null = await FamilyModel.findOne({ YX_CODE: GA_LIBREART1, YX_TYPE: "LA1"})
            
            if(family) {
                
                product = {
                    GA_CODEARTICLE,     
                    GA_LIBCOMPL,      
                    GA_LIBELLE,  
                    _id,
                    family,
                    GA_LIBREART4,   // linked to brand collection
                    GA_FOURNPRINC, 
                    GA_FERME,      
                    GA_VERSION,
                    GA_HISTORIQUE,
                    uvcs,
                    brand,
                } as PopulatedProduct

            }
        }

            
        if(GA_LIBREART2) {
            const subFamily: Family | undefined | null = await FamilyModel.findOne({ YX_CODE: GA_LIBREART2, YX_TYPE: "LA2"})
            if(subFamily) {
                
                product = {
                    GA_CODEARTICLE,     
                    GA_LIBCOMPL,      
                    GA_LIBELLE,  
                    _id,
                    GA_LIBREART4,   // linked to brand collection
                    GA_FOURNPRINC, 
                    GA_FERME,      
                    GA_VERSION,
                    GA_LIBREART1,
                    GA_LIBREART2,
                    GA_HISTORIQUE,
                    uvcs,
                    brand,
                    ...product,
                    subFamily
                } as PopulatedProduct

            }
        }

        data.push(product as PopulatedProduct)


    }

    return data;
}

export const productPopulateBrand = async(documents: Product | Product[]) : Promise<PopulatedProduct[]> => {
    if(!Array.isArray(documents)) {
        documents = [documents]
    }
    const data: PopulatedProduct[] = [];

    for (const document of documents) {
        const {    
            GA_LIBREART4,   // linked to the familly collection
            _id
        } = document;

        if(GA_LIBREART4) {
            const brand: Brand | undefined | null = await BrandModel.findOne({ YX_CODE: GA_LIBREART4})
            
            if(brand) {
                
                const {  
                    GA_CODEARTICLE,     
                    GA_LIBCOMPL,      
                    GA_LIBELLE,    
                    GA_LIBREART1,   // linked to the familly collection
                    GA_LIBREART2,   // linked to sous famile in the family collection
                    GA_LIBREART4,   // linked to brand collection
                    GA_FOURNPRINC, 
                    GA_FERME,      
                    GA_VERSION,
                    GA_HISTORIQUE,
                    _id,
                    uvcs,
                    family,
                    subFamily
                } = document as PopulatedProduct;

                const product = {
                    GA_CODEARTICLE,     
                    GA_LIBCOMPL,      
                    GA_LIBELLE,    
                    GA_LIBREART1,   // linked to the familly collection
                    GA_LIBREART2,   // linked to sous famile in the family collection
                    GA_LIBREART4,   // linked to brand collection
                    GA_FOURNPRINC, 
                    GA_FERME,      
                    GA_VERSION,
                    GA_HISTORIQUE,
                    _id,
                    uvcs,
                    family,
                    subFamily,
                    brand
                } as PopulatedProduct

                data.push(product)
            }
        }
    }



    return data;
}