import express, { Request, Response } from "express";
import ProductModel, { Product } from "../../schemas/productSchema";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";
import BrandModel, { Brand } from "../../schemas/brandSchema";
import CollectionModel, { Collection } from "../../schemas/collectionSchema";
import DimensionModel, { Dimension } from "../../schemas/dimensionSchema";
import TagModel, { Tag } from "../../schemas/tagSchema";
import SupplierModel, { Supplier } from "../../schemas/supplierSchema";
import { ObjectId, Types } from "mongoose";

const { ObjectId } = Types;
const router = express.Router();


// router.get(PRODUCT + "/change-to-date-format", async(req: Request, res: Response) => {
// console.log("HEREEE")
//   try {

//     // await ProductModel.updateMany(
//     //   { 
//     //     $or: [
//     //       { "creation_date": { $eq: null } },   // Match documents where creation_date is null
//     //       { "creation_date": { $exists: false } }  // Match documents where creation_date is undefined
//     //     ]
//     //   },
//     //   {
//     //     $set: {
//     //       "creation_date": new Date(0)  // Set creation_date to an empty date (Unix epoch: 1970-01-01)
//     //     }
//     //   }
//     // );
    
//     // await ProductModel.updateMany(
//     //   { 
//     //     creation_date: { $type: "string", $ne: ''  }, 
//     //     modification_date: { $type: "string", $ne: ''  }
//     //   },
//     //   [
//     //     {
//     //       $set: {
//     //         creation_date: {
//     //           $dateFromString: {
//     //             dateString: "$creation_date"
//     //           }
//     //         },
//     //         modification_date: {
//     //           $dateFromString: {
//     //             dateString: "$modification_date"
//     //           }
//     //         }
//     //       }
//     //     }
//     //   ]
//     // );

//     await ProductModel.updateMany(
//       { 
//         creation_date: { $type: "string", $ne: "" }, 
//         modification_date: { $type: "string", $ne: "" }
//       },
//       [
//         {
//           $set: {
//             creation_date: {
//               $cond: {
//                 if: { $and: [
//                   { $ne: ["$creation_date", ""] },  // Ensure creation_date is not an empty string
//                   { $regexMatch: { input: "$creation_date", regex: /^\d{2}-\d{2}-\d{4}/ } }  // Check if the format is dd-mm-yyyy
//                 ] },
//                 then: { $dateFromString: { dateString: "$creation_date", format: "%d-%m-%Y" } },  // Convert valid date strings
//                 else: "$creation_date"  // Leave as-is if empty or invalid
//               }
//             },
//             modification_date: {
//               $cond: {
//                 if: { $and: [
//                   { $ne: ["$modification_date", ""] },  // Ensure modification_date is not an empty string
//                   { $regexMatch: { input: "$modification_date", regex: /^\d{2}-\d{2}-\d{4}/ } }  // Check if the format is dd-mm-yyyy
//                 ] },
//                 then: { $dateFromString: { dateString: "$modification_date", format: "%d-%m-%Y" } },  // Convert valid date strings
//                 else: "$modification_date"  // Leave as-is if empty or invalid
//               }
//             }
//           }
//         }
//       ]
//     );
    

//     // await ProductModel.updateMany(
//     //   { 
//     //     creation_date: { $type: "string", $ne: "" }, 
//     //     modification_date: { $type: "string", $ne: "" }
//     //   },
//     //   [
//     //     {
//     //       $set: {
//     //         creation_date: {
//     //           $cond: {
//     //             if: { $and: { $ne: ["$creation_date", ""] } },  // Check for non-empty and valid date format
//     //             then: { $dateFromString: { dateString: "$creation_date" } },  // Convert valid date strings
//     //             else: "$creation_date"  // Leave as-is if empty or invalid
//     //           }
//     //         },
//     //         modification_date: {
//     //           $cond: {
//     //             if: { $and: { $ne: ["$modification_date", ""] } },  // Check for non-empty and valid date format
//     //             then: { $dateFromString: { dateString: "$modification_date" } },  // Convert valid date strings
//     //             else: "$modification_date"  // Leave as-is if empty or invalid
//     //           }
//     //         }
//     //       }
//     //     }
//     //   ]
//     // );
    

//     // // Perform the aggregation
//     // const result = await ProductModel.aggregate(pipeline)

//     // console.log("Result here: " , typeof result[1].creation_date_2)

//     res.status(200)


    
//   } catch(error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// })





// router.get(PRODUCT + "/aggregate", async(req: Request, res: Response) => {

//   try {
//      // Define the aggregation pipeline
//      const pipeline = [
//       {
//         '$match': {
//           'status': 'A'
//         }
//       }, {
//         '$lookup': {
//           'from': 'collection', 
//           'localField': 'collection_ids', 
//           'foreignField': '_id', 
//           'as': 'collections'
//         }
//       }, {
//         '$group': {
//           '_id': '$collection_ids', 
//           'count': {
//             '$sum': 1
//           }
//         }
//       }
//     ]
//     const data: any = await ProductModel.aggregate(pipeline);

//     res.status(200).json(data);

//   } catch(err) {
//     console.error(err);
//     res.status(500).json(err);
//   }


// })

// This isn't good practice but you mfs can't distinguish a good practice vs a bad one soooooo =)
// router.get(PRODUCT + "/validated-projects" , async(req: Request, res: Response) => {

//   const {created_at}

// })

// Again bad practice but yall dont gaf so neither do i anymore
router.get(PRODUCT + "/bar-graph-data", authorizationMiddlewear, async (req:Request, res:Response) => {

  try {
    let count = 0;
    let tooLong = 0;
    const map : { [key: string] : number }= { }
    while(count !== 5) {

      const c = await CollectionModel.find().sort({creation_date: -1}).limit(100) as any[]

      if(c[tooLong] && c[tooLong]._id) {
        const tally = await ProductModel.countDocuments({
          collection_ids: { $in: [ c[tooLong]._id ] }  // Check if the collectionId matches an element in the array
        });
        if(tally > 0) {
          map[c[tooLong].label] = tally;
          count++;
        }
      }
  
     
      tooLong++;  // just to make sure this doesn't spin forever
      if(tooLong === 100) break;
    }
  
  
    res.status(200).json(map)

  } catch(error) {
    console.error("I can't believe that I'm taking orders from a guy that writes caca boom for an error message: " , error)
    res.status(500).json(error)
  }


  

})

router.get(
  PRODUCT + "/search",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const { supplier, tag, sub_family, reference, long_label, brand, collection, dimension, status, name, creation_date } = req.query;


      const { skip, intLimit } = await generalLimits(req);
      console.log(req.query)
      let referenceIds: any[] | null | undefined
      let brandIds: any[] | null | undefined;
      let collectionIds: any[] | null | undefined;
      let dimensionIds: any[] | null | undefined;
      let tagIds: any[] | null | undefined;
      let supplierIds: any[] | null | undefined;

      let filter: any = {};


      if(creation_date) {
        const o = { creation_date : {$gt: new Date(creation_date as string)}}
        filter = {...filter, ...o}
      }

      if(name) {
        const nameRegex = new RegExp(name as string, "i");
        filter = { ...filter, name: nameRegex}
      }

      // works
      if(reference) {
        const referenceRegex = new RegExp(reference as string, "i");
        filter = { ...filter, reference: referenceRegex}
      }

      // works 
      if(long_label) {
        const long_labelRegex = new RegExp(long_label as string, "i");
        filter = { ...filter, long_label: long_labelRegex}
      }

      // works
      // Recherche par marque
      if (brand) {
        const brandRegex = new RegExp(brand as string, "i");
        
        const brandByLabel = await BrandModel.find({ label: { $regex: brandRegex } }).select("_id");
        const brandByCode = await BrandModel.find({ name: { $regex: brandRegex } }).select("_id");
        
        brandIds = [...brandByLabel, ...brandByCode]
        
        const $in: ObjectId[] = brandIds.map(doc => doc._id);
        filter = { ...filter, brand_ids: { $in } };
      }
      

      // NOT NEEDED
      if (collection) {
        const collectionRegex = new RegExp(collection as string, "i");
        collectionIds = await CollectionModel.find({ label: { $regex: collectionRegex } }).select("_id");
        const $in: ObjectId[] = collectionIds.map(doc => doc._id);
        filter = { ...filter, collection_ids: { $in } }; 
      }

      // no working
      if (dimension) {
        const dimensionRegex = new RegExp(dimension as string, "i");
        dimensionIds = await DimensionModel.find({ label: { $regex: dimensionRegex } }).select("_id");
        const $in: any[] = dimensionIds.map(doc => doc._id);
        filter = { ...filter, dimension_types: { $in } };
      }

      // Recherche par statut
      // works
      if (status) {
        const statusRegex = new RegExp(status as string,'i')
        filter = { ...filter, status: statusRegex };
      }

      // works
      if (tag) {
        const tagRegex = new RegExp(tag as string, "i");
        const tagByName = await TagModel.find({ name: { $regex: tagRegex } }).select("_id");
        const tagByCode = await TagModel.find({ name: { $regex: tagRegex } }).select("_id");

        // tagIds = await TagModel.find({ name: { $regex: tagRegex } }).select("_id");
        // code 
        tagIds = [...tagByCode, tagByName]
        const $in: ObjectId[] = tagIds.map(doc => doc._id);
        filter = { ...filter, tag_ids: { $in } };
      }

      // doesnt work
      if (supplier) {
        const supplierRegex = new RegExp(supplier as string, "i");
        supplierIds = await SupplierModel.find({ company_name: { $regex: supplierRegex } }).select("_id");
        const $in: ObjectId[] = supplierIds.map(doc => doc._id );
        // filter = { ...filter, 'suppliers.supplier_id': { $in } }; 
        const x = {supplier_id: {$in}}
        // filter = { ...filter, suppliers: { $elemMatch: {supplier_id: { $in }} }}
        filter = { ...filter, 'suppliers.supplier_id': { $in }}

      }
      
      const data: Product[] | null | undefined = await ProductModel.find(filter)
        .skip(skip)
        .limit(intLimit)
        .populate("brand_ids")
        .populate("collection_ids")
        .populate("tag_ids")
        .populate({
          path: 'suppliers.supplier_id',
          model: 'supplier',
        })
        .populate("uvc_ids")

      if (!data) {
        throw new Error(req.originalUrl + ", msg: find error");
      }


      const total = await ProductModel.countDocuments(filter);

      res.status(200).json({ data, total });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
);


router.get(
  PRODUCT,
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const { skip, intLimit } = await generalLimits(req);

      const data: Product[] | null | undefined = await ProductModel.find()
        .skip(skip)
        .limit(intLimit)
        .populate("brand_ids")
        .populate("collection_ids")
        .populate("tag_ids")
        .populate({
          path: 'suppliers.supplier_id',
          model: 'supplier',
        })
        .populate("uvc_ids")

      if (data === null || data === undefined) {
        throw new Error(req.originalUrl + ", msg: find error");
      }

      const total = await ProductModel.countDocuments({});

      res.status(OK).json({ data, total });
    } catch (err) {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

router.get(
  PRODUCT + "/:id",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const id: string | undefined | null = req.params.id;

      if (id === null || id === undefined) {
        res.status(BAD_REQUEST).json({});
        throw new Error(req.originalUrl + ", msg: id was: " + id);
      }

      const data: Product | null | undefined = await ProductModel.findById(id)
      .populate("uvc_ids")
      .populate("brand_ids")
      .populate("collection_ids")
      .populate("tag_ids")
      .populate({
        path: 'suppliers.supplier_id',
        model: 'supplier',
      });

      if (data === null || data === undefined) {
        throw new Error(req.originalUrl + ", msg: find error");
      }

      res.status(OK).json(data);
    } catch (err) {
      res.status(BAD_REQUEST).json(err);
      console.error(err);
    }
  }
);



export default router;