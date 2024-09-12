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

router.get(
  PRODUCT + "/search",
  authorizationMiddlewear,
  async (req: Request, res: Response) => {
    try {
      const { supplier, tag, reference, long_label, brand, collection, dimension, status } = req.query;

      const { skip, intLimit } = await generalLimits(req);
      console.log(req.query)
      let referenceIds: any[] | null | undefined
      let brandIds: any[] | null | undefined;
      let collectionIds: any[] | null | undefined;
      let dimensionIds: any[] | null | undefined;
      let tagIds: any[] | null | undefined;
      let supplierIds: any[] | null | undefined;

      let filter: any = {};


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

      console.log("FILTR: " , filter)
      
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

