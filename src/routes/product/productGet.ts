import express, { Request, Response } from "express"
import ProductModel, {  Product } from "../../schemas/productSchema";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

// import { productPopulateBrand, productPopulateFamily, productPopulateUvc } from "../../services/productServices";
import { generalLimits } from "../../services/generalServices";

const router = express.Router();

router.get(PRODUCT + "/ga-libelle/:GA_LIBELLE", async(req: Request, res: Response) => {
    try {
  
      const { GA_LIBELLE } = req.params;
  
      if(!GA_LIBELLE){
        throw new Error("GA_LIBELLE was falsy")
      }
  
      const page: string | any | string[] | undefined = req.query.page;
      const limit: string | any | string[] | undefined = req.query.limit;
  
      let intPage;
      let intLimit;
  
      if(!page) {
          intPage = 1;
      } else {
          intPage = parseInt(page) 
      }
  
  
      if(!limit) {
          intLimit = 10;        
      } else {
          intLimit = parseInt(limit); 
      }    
  
      const document : Product | null | undefined = await ProductModel.findOne({GA_LIBELLE});
  
      if(!document) {
        console.warn("product was falsy");
        res.status(200).json({});
        return;
      }
  
  
      let data = await productPopulateUvc(document);
      data = await productPopulateFamily(data);
      data = await productPopulateBrand(data);

      res.status(200).json(data)
  
  
    } catch(err) {
      console.error(err)
      res.status(400).json({})
    }
  })
  

  router.get(PRODUCT + "/search", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {
      const { GA_CODEARTICLE, GA_LIBCOMPL, GA_LIBELLE, GA_LIBREART4, GA_LIBREART1, GA_LIBREART2, GA_FOURNPRINC, GA_FERME, page = 1, limit = 10 } = req.query;
      
      let filter: any = { $and: [] };  // any to make typescript stop complaining
      
      if (GA_CODEARTICLE) {
        const regEx = new RegExp(GA_CODEARTICLE as string, "i");
        filter.$and.push({ GA_CODEARTICLE: regEx });
      }
  
      if (GA_LIBCOMPL) {
        const regEx = new RegExp(GA_LIBCOMPL as string, "i");
        filter.$and.push({ GA_LIBCOMPL: regEx });
      }
  
      if (GA_LIBELLE) {
        const regEx = new RegExp(GA_LIBELLE as string, "i");
        filter.$and.push({ GA_LIBELLE: regEx });
      }
  
      if (GA_LIBREART4) {
        filter.$and.push({ GA_LIBREART4 });
      }
  
      if (GA_LIBREART1) {
        filter.$and.push({ GA_LIBREART1 });
      }
  
      if (GA_LIBREART2) {
        filter.$and.push({ GA_LIBREART2 });
      }
  
      if (GA_FOURNPRINC) {
        const regEx = new RegExp(GA_FOURNPRINC as string, "i");
        filter.$and.push({ GA_FOURNPRINC: regEx });
      }
  
      if (GA_FERME) {
        const regEx = new RegExp(GA_FERME as string, "i");
        filter.$and.push({ GA_FERME: regEx });
      }
  
      if (filter.$and.length === 0) {
        delete filter.$and;
      }
  
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const documents: Product[] | null | undefined = await ProductModel.find(filter).skip(skip).limit(parseInt(limit as string));
  
      if (documents === null || documents === undefined) {
        throw new Error(req.originalUrl + ", msg: find error");
      }
  
      let data = await productPopulateUvc(documents);
      data = await productPopulateFamily(data);
      data = await productPopulateBrand(data);
  
      const total = await ProductModel.countDocuments(filter);
  
      res.status(200).json({ data, total });
  
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  

router.get(PRODUCT, authorizationMiddlewear, async(req: Request, res: Response) => {
    try {

        const { skip, intLimit } = await generalLimits(req);

        const documents: Product[] | null | undefined = await ProductModel.find().skip(skip).limit(intLimit);

        if ( documents === null ||  documents === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }

        let data = await productPopulateUvc(documents);
        data = await productPopulateFamily(data);
        data = await productPopulateBrand(data);
 
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

        let data = await productPopulateUvc(document);
        data = await productPopulateFamily(data);
        data = await productPopulateBrand(data);

        res.status(OK).json(data)

    }
    catch(err) {
        res.status(BAD_REQUEST).json(err)
        console.error(err)
    }


})

export default router;  


/*

 */