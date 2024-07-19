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
      const { supplier, tag, brand, collection, dimension, dimension_type } =
        req.query;

      const { skip, intLimit } = await generalLimits(req);

      let brandIds: Brand[] | null | undefined;
      let collectionIds: Collection[] | null | undefined;
      let dimensionIds: Dimension[] | null | undefined;
      let tagIds: Tag[] | null | undefined;
      let supplierIds: Supplier[] | null | undefined;

      let filter: any = {};

      if (brand) {
        const brandRegex = new RegExp(brand as string, "i");
        brandIds = await BrandModel.find({
          label: { $regex: brandRegex },
        }).select("_id");
        const $in: ObjectId[] = [];
        brandIds.forEach((doc) => $in.push(doc._id as ObjectId));
        filter = { ...filter, brand_id: { $in } };
      }

      if (collection) {
        const collectionRegex = new RegExp(collection as string, "i");
        collectionIds = await CollectionModel.find({
          label: { $regex: collectionRegex },
        }).select("_id");
        const $in: ObjectId[] = [];
        collectionIds.forEach((doc) => $in.push(doc._id as ObjectId));
        filter = { ...filter, collection_id: { $in } };
      }

      // NOT WOKRING
      if (dimension) {
        const dimensionRegex = new RegExp(dimension as string, "i");
        dimensionIds = await DimensionModel.find({
          label: { $regex: dimensionRegex },
        }).select("_id");
        const $in: any[] = [];
        dimensionIds.forEach((doc) => $in.push(doc._id as any));
        filter = { ...filter, dimension_ids: { $in } };
      }

      // if the latest dump file does not work

      // if (dimension_type) {
      //   const dimensionTypeRegex = new RegExp(dimension_type as string, "i");
      //   dimensionTypeIds = await DimensionTypeModel.find({ type: {$regex: dimensionTypeRegex}}).select("_id")
      //   const $in = dimensionTypeIds.map(doc => doc._id)
      //   filter = {...filter, dimension_type_id: {$in}}
      // }

      if (tag) {
        const tagIdRegex = new RegExp(tag as string, "i");
        tagIds = await TagModel.find({ name: { $regex: tagIdRegex } }).select(
          "_id"
        );
        const $in: ObjectId[] = [];
        tagIds.forEach((doc) => $in.push(doc._id as ObjectId));
        filter = { ...filter, tag_ids: { $in } };
      }

      if (supplier) {
        const supplierIdRegex = new RegExp(supplier as string, "i");
        supplierIds = await SupplierModel.find({
          label: { $regex: supplierIdRegex },
        }).select("_id");
        const $in: ObjectId[] = [];
        supplierIds.forEach((doc) => $in.push(doc._id as ObjectId));
        filter = { ...filter, supplier_id: { $in } };
      }

      const data: Product[] | null | undefined = await ProductModel.find(filter)
        .skip(skip)
        .limit(intLimit);

      if (data === null || data === undefined) {
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
        .populate("princ_supplier_id")
        .populate("supplier_ids");

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
        .populate("brand_ids")
        .populate("collection_ids")
        .populate("tag_ids")
        .populate("uvc_ids")
        .populate("princ_supplier_id")
        .populate("supplier_ids");

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

/*

 */
