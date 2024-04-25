import express, { Request, Response } from "express"
import ProductModel, { PopulatedProduct, Product } from "../../schemas/productSchema";
import { Document } from "mongoose";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { getUvc } from "../../services/productServices";
import UvcModel, { Uvc } from "../../schemas/uvcSchema";
import FamilyModel, { Family } from "../../schemas/familySchema";
import BrandModel, { Brand } from "../../schemas/brandSchema";

const router = express.Router();

router.get(PRODUCT + "/search", authorizationMiddlewear, async( req: Request, res: Response) => {
    try {
        const limit: string | any | string[] | undefined = req.query.limit;

        let intLimit;

        if(!limit) {
            intLimit = 1000;        
        } else {
            intLimit = parseInt(limit); 
        }        

        const value = req.query.value;

        if(!value) {
            throw new Error(req.originalUrl + ", msg: value in family routes get was falsy: " + value);
        } 


        // both the yx code and yx libelle can be very similar, so we should just do an or and a regex in both fields
        const documents: Document[] | null | undefined = await ProductModel.find(
            { 
                $or: [
                        {
                            GA_LIBCOMPL: { $regex: value as string}
                        },
                        {
                            GA_LIBELLE: { $regex: value as string}
                        }
                    ] 
            }
        ).limit(intLimit);


        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        res.status(OK).json(documents)

    } catch(err) {
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }

})

router.get(PRODUCT, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {
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
            intLimit = 100;        
        } else {
            intLimit = parseInt(limit); 
        }        

        const skip = (intPage - 1) * intLimit;

        const documents: Product[] | null | undefined = await ProductModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        const data = [];
        for (let document of documents) {
            const { GA_CODEARTICLE } = document;

            if(GA_CODEARTICLE) {
    
                // Check to see if matching uvc
                const uvc: Uvc | undefined | null = await UvcModel.findOne({GA_CODEARTICLE});
                
                // if uvc, then add the uvc into the document
                if(uvc) {
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
                        GA_HISTORIQUE
                    } = document;
    
    
                    document = {  
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
                        uvc 
                    } as PopulatedProduct
    
                    // if ga libreart1 is not undefined, lets see if there are any values in family collection for it
                    if(GA_LIBREART1) {
                        const family: Family | undefined | null = await FamilyModel.findOne({ YX_CODE: GA_LIBREART1, YX_TYPE: "LA1"})
                        
                        if(family) {
                            
                            document = {
                                ...document,    // we can destructure document like this now because its a normal object now and not a weird mongoose thing
                                family
                            } as PopulatedProduct
    
                        }
                    }
    
                    if(GA_LIBREART2) {
                        const subFamily: Family | undefined | null = await FamilyModel.findOne({ YX_CODE: GA_LIBREART2, YX_TYPE: "LA2"})
                        if(subFamily) {
                            
                            document = {
                                ...document,    // we can destructure document like this now because its a normal object now and not a weird mongoose thing
                                subFamily
                            } as PopulatedProduct
    
                        }
                    }
    
                    if(GA_LIBREART4) {
                        const brand: Brand | undefined | null = await BrandModel.findOne({ YX_CODE: GA_LIBREART4})
                        
                        if(brand) {
                            
                            document = {
                                ...document,    // we can destructure document like this now because its a normal object now and not a weird mongoose thing
                                brand
                            } as PopulatedProduct
    
                        }
                    }
    
                }
    
            }
            
            data.push(document)
        }

        const total = await ProductModel.countDocuments({});

        res.status(OK).json({ data, total})
    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


router.get(PRODUCT + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

        const id: string | undefined | null = req.params.id;

        if(id === null || id === undefined) {
            res.status(BAD_REQUEST).json({})
            throw new Error(req.originalUrl + ", msg: id was: " + id)
        }

        let document: Product | null | undefined = await ProductModel.findById(id);


        if ( document === null ||  document === undefined) {
            res.status(OK).json({});
            console.warn(req.originalUrl + ", msg: Document was null or undefined");
            return;
        }

        const { GA_CODEARTICLE } = document;

        if(GA_CODEARTICLE) {

            // Check to see if matching uvc
            const uvc: Uvc | undefined | null = await UvcModel.findOne({GA_CODEARTICLE});
            
            // if uvc, then add the uvc into the document
            if(uvc) {
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
                    GA_HISTORIQUE
                } = document;


                document = {  
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
                    uvc 
                } as PopulatedProduct

                // if ga libreart1 is not undefined, lets see if there are any values in family collection for it
                if(GA_LIBREART1) {
                    const family: Family | undefined | null = await FamilyModel.findOne({ YX_CODE: GA_LIBREART1, YX_TYPE: "LA1"})
                    
                    if(family) {
                        
                        document = {
                            ...document,    // we can destructure document like this now because its a normal object now and not a weird mongoose thing
                            family
                        } as PopulatedProduct

                    }
                }

                if(GA_LIBREART2) {
                    const subFamily: Family | undefined | null = await FamilyModel.findOne({ YX_CODE: GA_LIBREART2, YX_TYPE: "LA2"})
                    if(subFamily) {
                        
                        document = {
                            ...document,    // we can destructure document like this now because its a normal object now and not a weird mongoose thing
                            subFamily
                        } as PopulatedProduct

                    }
                }

                if(GA_LIBREART4) {
                    const brand: Brand | undefined | null = await BrandModel.findOne({ YX_CODE: GA_LIBREART4})
                    
                    if(brand) {
                        
                        document = {
                            ...document,    // we can destructure document like this now because its a normal object now and not a weird mongoose thing
                            brand
                        } as PopulatedProduct

                    }
                }

            }

        }


        res.status(OK).json(document)

    }
    catch(err) {
        res.status(BAD_REQUEST).json(err)
        console.error(err)
    }


})

export default router;  