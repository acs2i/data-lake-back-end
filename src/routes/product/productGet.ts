import express, { Request, Response } from "express";
import ProductModel, { Product } from "../../schemas/productSchema";
import { OK } from "../../codes/success";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../codes/errors";
import { PRODUCT } from "./shared";
import authorizationMiddlewear from "../../middlewears/applicationMiddlewear";
import { generalLimits } from "../../services/generalServices";
import BrandModel from "../../schemas/brandSchema";
import CollectionModel from "../../schemas/collectionSchema";
import DimensionModel from "../../schemas/dimensionSchema";
import TagModel from "../../schemas/tagSchema";
import SupplierModel from "../../schemas/supplierSchema";
import { Types } from "mongoose";

const { ObjectId } = Types;
const router = express.Router();

router.get(
  PRODUCT + "/search",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const { supplier, tag, sub_family, reference, long_label, brand, collection, dimension, status, name } = req.query;


      const { skip, intLimit } = await generalLimits(req);
      console.log(req.query);

      let filter: any = {};

      if (reference) {
        const referenceRegex = new RegExp(reference as string, "i");
        filter.reference = referenceRegex;
      }

      if (long_label) {
        const long_labelRegex = new RegExp(long_label as string, "i");
        filter.long_label = long_labelRegex;
      }

      if (brand) {
        const brandRegex = new RegExp(brand as string, "i");
        const brandIds = await BrandModel.find({ 
          $or: [
            { label: { $regex: brandRegex } },
            { name: { $regex: brandRegex } }
          ]
        }).select("_id");
        filter.brand_ids = { $in: brandIds.map(doc => doc._id) };
      }

      if (collection) {
        const collectionRegex = new RegExp(collection as string, "i");
        const collectionIds = await CollectionModel.find({ label: { $regex: collectionRegex } }).select("_id");
        filter.collection_ids = { $in: collectionIds.map(doc => doc._id) };
      }

      if (dimension) {
        const dimensionRegex = new RegExp(dimension as string, "i");
        const dimensionIds = await DimensionModel.find({ label: { $regex: dimensionRegex } }).select("_id");
        filter.dimension_types = { $in: dimensionIds.map(doc => doc._id) };
      }

      if (status) {
        const statusRegex = new RegExp(status as string, 'i');
        filter.status = statusRegex;
      }

      if (tag) {
        const tagRegex = new RegExp(tag as string, "i");
<<<<<<< HEAD
        const tagIds = await TagModel.find({ 
          $or: [
            { name: { $regex: tagRegex } },
            { code: { $regex: tagRegex } }
          ]
        }).select("_id");
        filter.tag_ids = { $in: tagIds.map(doc => doc._id) };
=======
        const tagByName = await TagModel.find({ name: { $regex: tagRegex }, level: "famille" }).select("_id");
        const tagByCode = await TagModel.find({ name: { $regex: tagRegex }, level: "famille" }).select("_id");

        
        const tagIds = [...tagByCode, ...tagByName];
        const $in: ObjectId[] = tagIds.map(doc => doc._id);
        filter = { ...filter, tag_ids: { $in } };
>>>>>>> 10691bacc46c95ffcc9701fd26bffa571f8235e6
      }
      
      if (sub_family) {
        const subFamilyRegex = new RegExp(sub_family as string, "i");
        const subFamilyByName = await TagModel.find({ name: { $regex: subFamilyRegex }, level: "sous-famille" }).select("_id");
        const subFamilyByCode = await TagModel.find({ name: { $regex: subFamilyRegex }, level: "sous-famille" }).select("_id");
        
        const subFamilyIds = [...subFamilyByCode, ...subFamilyByName];
        const $inSubFamily: ObjectId[] = subFamilyIds.map(doc => doc._id);
        filter = { ...filter, tag_ids: { $in: $inSubFamily } };
      }

      if (supplier) {
        const supplierRegex = new RegExp(supplier as string, "i");
        const supplierIds = await SupplierModel.find({ company_name: { $regex: supplierRegex } }).select("_id");
        filter['suppliers.supplier_id'] = { $in: supplierIds.map(doc => doc._id) };
      }

      console.log("FILTER: ", filter);
      
      const data: Product[] = await ProductModel.find(filter)
        .skip(skip)
        .limit(intLimit)
        .populate("brand_ids")
        .populate("collection_ids")
        .populate("tag_ids")
        .populate({
          path: 'suppliers.supplier_id',
          model: 'supplier',
        })
        .populate("uvc_ids");

      const total = await ProductModel.countDocuments(filter);

      res.status(200).json({ data, total });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
);

export default router;