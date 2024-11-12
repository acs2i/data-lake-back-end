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
import { exportToCSV } from "../../services/csvExportAll";
import { getFormattedDate } from "../../services/formatDate";

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
router.get(
  PRODUCT + "/bar-graph-data",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      let count = 0;
      let tooLong = 0;
      const map: { [key: string]: number } = {};
      while (count !== 5) {
        const c = (await CollectionModel.find()
          .sort({ creation_date: -1 })
          .limit(100)) as any[];

        if (c[tooLong] && c[tooLong]._id) {
          const tally = await ProductModel.countDocuments({
            collection_ids: { $in: [c[tooLong]._id] }, // Check if the collectionId matches an element in the array
          });
          if (tally > 0) {
            map[c[tooLong].label] = tally;
            count++;
          }
        }

        tooLong++; // just to make sure this doesn't spin forever
        if (tooLong === 100) break;
      }

      res.status(200).json(map);
    } catch (error) {
      console.error(
        "I can't believe that I'm taking orders from a guy that writes caca boom for an error message: ",
        error
      );
      res.status(500).json(error);
    }
  }
);

router.get(
  PRODUCT + "/search",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const {
        supplier,
        tag,
        reference,
        long_label,
        brand,
        collection,
        status,
        name,
        creation_date,
        exportToCsv,
      } = req.query;

      let filter: any = {};

      if (creation_date)
        filter.creation_date = { $gt: new Date(creation_date as string) };
      if (name) filter.name = new RegExp(name as string, "i");
      if (reference) filter.reference = new RegExp(reference as string, "i");
      if (long_label) filter.long_label = new RegExp(long_label as string, "i");
      if (status) filter.status = new RegExp(status as string, "i");

      if (brand) {
        const brandRegex = new RegExp(brand as string, "i");
        const brandIds = await BrandModel.find({
          $or: [
            { label: { $regex: brandRegex } },
            { name: { $regex: brandRegex } },
          ],
        }).select("_id");
        filter.brand_ids = { $in: brandIds.map((b) => b._id) };
      }

      if (collection) {
        const collectionRegex = new RegExp(collection as string, "i");
        const collectionIds = await CollectionModel.find({
          label: { $regex: collectionRegex },
        }).select("_id");
        filter.collection_ids = { $in: collectionIds.map((c) => c._id) };
      }

      if (supplier) {
        const supplierRegex = new RegExp(supplier as string, "i");
        const supplierIds = await SupplierModel.find({
          company_name: { $regex: supplierRegex },
        }).select("_id");
        filter["suppliers.supplier_id"] = {
          $in: supplierIds.map((s) => s._id),
        };
      }

      const query = ProductModel.find(filter)
        .sort({ creation_date: -1 })
        .populate({
          path: "brand_ids",
          select: "code name",
        })
        .populate({
          path: "collection_ids",
          select: "code label",
        })
        .populate({
          path: "tag_ids",
          select: "code name",
        })
        .populate({
          path: "suppliers.supplier_id",
          select: "code company_name",
        });

      if (exportToCsv === "true") {
        const products = await query.lean();

        const formatNumber = (value: any): string => {
          const num = parseFloat(value);
          return isNaN(num) ? "0.000" : num.toFixed(3);
        };

        const formatPrice = (value: any): string => {
          const num = parseFloat(value);
          return isNaN(num) ? "0.00" : num.toFixed(2);
        };

        const formatDate = (date: Date | string | undefined) => {
          if (!date) return "";
          return new Date(date).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
        };

        // S'assurer que products est un tableau non vide
        if (!Array.isArray(products) || products.length === 0) {
          throw new Error("No products found to export");
        }

        const transformedProducts = products.map((product) => ({
          reference: product.reference || "",
          alias: product.alias || "",
          long_label: product.long_label || "",
          short_label: product.short_label || "",
          type: product.type || "",
          brandcode: (product.brand_ids?.[0] as any)?.code || "",
          famcode: (product.tag_ids?.[0] as any)?.code || "",
          sfamcode: (product.tag_ids?.[1] as any)?.code || "",
          ssfamcode: (product.tag_ids?.[2] as any)?.code || "",
          collectioncode: (product.collection_ids?.[0] as any)?.code || "",
          supplier: (product.suppliers?.[0]?.supplier_id as any)?.code || "",
          supplierref: product.suppliers?.[0]?.supplier_ref || "",
          pcb: product.suppliers?.[0]?.pcb || "",
          madein: product.suppliers?.[0]?.made_in || "",
          custom_category: product.suppliers?.[0]?.custom_cat || "",
          weightmeasureunit: product.weight_measure_unit || "",
          netweight: formatNumber(product.net_weight),
          grossweight: formatNumber(product.gross_weight),
          dimensionmeasureunit: product.dimension_measure_unit || "",
          height: formatNumber(product.height),
          length: formatNumber(product.length),
          width: formatNumber(product.width),
          taxcode: product.taxcode || "",
          paeu: formatPrice(product.paeu),
          tbeu_pb: formatPrice(product.tbeu_pb),
          tbeu_pmeu: formatPrice(product.tbeu_pmeu),
          comment: product.comment || "",
          blocked: product.blocked || "",
          "01_coulfour": product.coulfour || "",
          "02_actif": "D",
          "03_visiblesurinternet": product.visible_on_internet || "Non",
          "04_ventesurinternet": product.sold_on_internet || "Non",
          "05_seuilinternet": product.seuil_internet || "",
          "06_enreassort": product.en_reassort || "",
          "07_remisegenerale": product.remisegenerale || "",
          "08_fixation": product.fixation || "",
          "09_ventemetre": product.ventemetre || "",
          "10_commentaire": "",
          status: product.status || "",
          creationdate: formatDate(product.creation_date),
          modificationdate: formatDate(product.updatedAt),
        }));

        const formattedDate = getFormattedDate();
        const fileName = `PREREF_Y2_ART_${formattedDate}.csv`;

        const fieldsToExport = [
          "reference",
          "alias",
          "long_label",
          "short_label",
          "type",
          "brandcode",
          "famcode",
          "sfamcode",
          "ssfamcode",
          "collectioncode",
          "supplier",
          "supplierref",
          "pcb",
          "madein",
          "custom_category",
          "weightmeasureunit",
          "netweight",
          "grossweight",
          "dimensionmeasureunit",
          "height",
          "length",
          "width",
          "taxcode",
          "paeu",
          "tbeu_pb",
          "tbeu_pmeu",
          "comment",
          "blocked",
          "01_coulfour",
          "02_actif",
          "03_visiblesurinternet",
          "04_ventesurinternet",
          "05_seuilinternet",
          "06_enreassort",
          "07_remisegenerale",
          "08_fixation",
          "09_ventemetre",
          "10_commentaire",
          "status",
          "creationdate",
          "modificationdate",
        ];

        exportToCSV(transformedProducts, fileName, fieldsToExport)
          .then((filePath) => {
            console.log(`Export completed: ${filePath}`);
          })
          .catch((error) => {
            console.error("Export failed:", error);
          });

        // Réponse immédiate
        return res.status(OK).json({
          msg: "Export started",
          totalToExport: transformedProducts.length,
        });

        // const csvFilePath = await exportToCSV(transformedProducts, fileName, fieldsToExport);

        // return res.status(OK).json({
        //     csvFilePath,
        //     totalExported: products.length,
        //     msg: "Products exported successfully"
        // });
      }

      // Si pas d'export, on applique la pagination
      const { skip, intLimit } = await generalLimits(req);
      const data = await query.skip(skip).limit(intLimit);
      const total = await ProductModel.countDocuments(filter);

      return res.status(OK).json({ data, total });
    } catch (err) {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).json(err);
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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(intLimit)
        .populate("brand_ids")
        .populate("collection_ids")
        .populate("tag_ids")
        .populate({
          path: "suppliers.supplier_id",
          model: "supplier",
        })
        .populate("uvc_ids");

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
          path: "suppliers.supplier_id",
          model: "supplier",
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

function formatNumber(value: any): any {
  const num = parseFloat(value);
  return isNaN(num) ? "0.000" : num.toFixed(3);
}

function formatPrice(value: any): any {
  const num = parseFloat(value);
  return isNaN(num) ? "0.00" : num.toFixed(2);
}
