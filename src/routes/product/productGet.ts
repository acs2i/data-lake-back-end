import express, { Request, Response } from "express"
import ProductModel, {  Product } from "../../schemas/productSchema";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";

// import { productPopulateBrand, productPopulateFamily, productPopulateUvc } from "../../services/productServices";
import { generalLimits } from "../../services/generalServices";
import BrandModel, { Brand } from "../../schemas/brandSchema";
import CollectionModel, { Collection } from "../../schemas/collectionSchema";
import DimensionModel, { Dimension } from "../../schemas/dimensionSchema";
import DimensionTypeModel from "../../schemas/dimensionTypeSchema";
import TagModel, { Tag } from "../../schemas/tagSchema";
import { TagGrouping } from "../../schemas/tagGroupingSchema";
import { Supplier } from "../../schemas/supplierSchema";

const router = express.Router();

// router.get(PRODUCT + "/ga-libelle/:GA_LIBELLE", async(req: Request, res: Response) => {
//     try {
  
//       const { GA_LIBELLE } = req.params;
  
//       if(!GA_LIBELLE){
//         throw new Error("GA_LIBELLE was falsy")
//       }
  
//       const page: string | any | string[] | undefined = req.query.page;
//       const limit: string | any | string[] | undefined = req.query.limit;
  
//       let intPage;
//       let intLimit;
  
//       if(!page) {
//           intPage = 1;
//       } else {
//           intPage = parseInt(page) 
//       }
  
  
//       if(!limit) {
//           intLimit = 10;        
//       } else {
//           intLimit = parseInt(limit); 
//       }    
  
//       const document : Product | null | undefined = await ProductModel.findOne({GA_LIBELLE});
  
//       if(!document) {
//         console.warn("product was falsy");
//         res.status(200).json({});
//         return;
//       }
  
  
//       let data = await productPopulateUvc(document);
//       data = await productPopulateFamily(data);
//       data = await productPopulateBrand(data);

//       res.status(200).json(data)
  
  
//     } catch(err) {
//       console.error(err)
//       res.status(400).json({})
//     }
//   })
  

  router.get(PRODUCT + "/search", authorizationMiddlewear, async (req: Request, res: Response) => {
    try {

      const { supplier, tag, tag_grouping, brand, collection, dimension, dimension_type } = req.query;
      
      const { skip, intLimit } = await generalLimits(req);

      let brandIds: Brand[] | null | undefined
      let collectionIds: Collection[] | null | undefined
      let dimensionIds: Dimension[] | null | undefined
      let dimensionTypeIds: Dimension[] | null | undefined
      let tagIds: Tag[] | null | undefined
      let tagGroupingIds: TagGrouping[] | null | undefined
      let supplierIds: Supplier[] | null | undefined

      let filter: any = {  }; 

      
      if (brand) {
        const brandRegex = new RegExp(brand as string, "i");
        brandIds = await BrandModel.find({ label: {$regex: brandRegex}}).select("_id")
        filter = {...filter, brand_id: {$in: brandIds}}
      }

      if (collection) {
        const collectionRegex = new RegExp(collection as string, "i");
        collectionIds = await CollectionModel.find({ label: {$regex: collectionRegex}}).select("_id")
        filter = {...filter, collection_id: {$in: collectionIds}}
      }

      if (dimension) {
        const dimensionRegex = new RegExp(dimension as string, "i");
        dimensionIds = await DimensionModel.find({ label: {$regex: dimensionRegex}}).select("_id")
        filter = {...filter, dimension_ids: {$in: dimensionIds}}
      }

      if (dimension_type) {
        const dimensionTypeRegex = new RegExp(dimension_type as string, "i");
        dimensionTypeIds = await DimensionTypeModel.find({ type: {$regex: dimensionTypeRegex}}).select("_id")
        filter = {...filter, dimension_type_id: {$in: dimensionTypeIds}}
      }

      if (tag) {
        const tagIdRegex = new RegExp(tag as string, "i");
        tagIds = await TagModel.find({ name: {$regex: tagIdRegex}}).select("_id")
        filter = {...filter, tag_ids: {$in: tagIds}}
      }

      if (tag_grouping) {
        const tagGroupingIdRegex = new RegExp(tag_grouping as string, "i");
        tagGroupingIds = await TagModel.find({ type: {$regex: tagGroupingIdRegex}}).select("_id")
        filter = {...filter, tag_grouping_ids: {$in: tagGroupingIds}}
      }
  
      if (supplier) {
        const supplierIdRegex = new RegExp(supplier as string, "i");
        supplierIds = await TagModel.find({ label: {$regex: supplierIdRegex}}).select("_id")
        filter = {...filter, tag_grouping_ids: {$in: supplierIds}}
      }
  
      
      const data: Product[] | null | undefined = await ProductModel.find(filter).skip(skip).limit(intLimit)
    
  
      if (data === null || data === undefined) {
        throw new Error(req.originalUrl + ", msg: find error");
      }
  
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

        const data: Product[] | null | undefined = await ProductModel
          .find().skip(skip).limit(intLimit)
          .populate("brand_id")
          .populate("collection_id")
          .populate({
            path: "dimension_ids",
            populate: {
              path: "dimension_type_id"
            }
          })
          .populate("dimension_type_id")
          .populate({ 
            path: "tag_ids",
            populate: { 
              path: "tag_grouping_id" 
            }
          })
          .populate("tag_grouping_ids")
          .populate("supplier_id")

        if ( data === null ||  data === undefined) {
            throw new Error(req.originalUrl + ", msg: find error")
        }


        const total = await ProductModel.countDocuments({});

        res.status(OK).json({ data, total})

    } catch(err) {
        console.error(err)
        res.status(INTERNAL_SERVER_ERROR).json(err)
    }
})


// router.get(PRODUCT + "/:id", authorizationMiddlewear, async (req: Request, res: Response) => {
//     try {

//         const id: string | undefined | null = req.params.id;

//         if(id === null || id === undefined) {
//             res.status(BAD_REQUEST).json({})
//             throw new Error(req.originalUrl + ", msg: id was: " + id)
//         }

//         let document: Product | null | undefined = await ProductModel.findById(id);


//         if ( document === null ||  document === undefined) {
//             res.status(OK).json({});
//             console.warn(req.originalUrl + ", msg: Document was null or undefined");
//             return;
//         }

//         let data = await productPopulateUvc(document);
//         data = await productPopulateFamily(data);
//         data = await productPopulateBrand(data);

//         res.status(OK).json(data)

//     }
//     catch(err) {
//         res.status(BAD_REQUEST).json(err)
//         console.error(err)
//     }


// })

export default router;  


/*

 */