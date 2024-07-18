import mongoose, { Date, Document, Model, ObjectId, Schema } from "mongoose";

interface Price {
  tarif_id: ObjectId;
  currency: string;
  supplier_id: ObjectId;
  price: number[];
  store: string;
}

export interface Uvc extends Document {
  code: string;
  product_id: ObjectId;
  dimensions: string[];
  prices: Price[];
  eans: string[];
  status: number;
  creator_id: ObjectId;
  additional_fields: any;
}

const priceSchema = new mongoose.Schema(
  {
    tarif_id: { type: mongoose.Types.ObjectId, ref: "tarif", default: "" },
    currency: { type: String },
    supplier_id: {
      type: mongoose.Types.ObjectId,
      ref: "supplier",
      default: "",
    },
    price: [{ type: Number }],
    store: { type: String },
  },
  { _id: false }
);

const uvcSchema = new mongoose.Schema<Uvc>(
  {
    code: { type: String },
    product_id: { type: mongoose.Types.ObjectId, ref: "product", default: "" },
    dimensions: [{ type: String }],
    prices: [priceSchema],
    eans: [{ type: String }],
    status: { type: Number },
    creator_id: { type: mongoose.Types.ObjectId },
    additional_fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true, collection: "uvc" }
);

const UvcModel: Model<Uvc> = mongoose.model<Uvc>("uvc", uvcSchema);

export default UvcModel;
