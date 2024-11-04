import mongoose, { Document, Model, ObjectId } from "mongoose";

interface Contact {
  firstname: string;
  lastname: string;
  function: string;
  phone: string;
  mobile: string;
  email: string;
}

interface Buyer {
  family: string[];
  user: string;
}

export interface Condition extends Document {
  supplier_id: ObjectId;
  season: string;
  code: string;
  company_name: string;
  siret: string;
  tva: string;
  web_url: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  address_3: string;
  city: string;
  postal: string;
  country: string;
  comment: string;
  tarif: number;
  contacts?: Contact[];
  brand_id: ObjectId[];
  status: string;
  creator: any;
  additional_fields?: any;
  admin: string;
  buyers: Buyer[];
}

const contactSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    function: { type: String },
    phone: { type: String },
    mobile: { type: String },
    email: { type: String },
  },
  { _id: false }
);

const buyerSchema = new mongoose.Schema(
  {
    family: [{ type: String }],
    user: { type: String },
  },
  { _id: false }
);

const conditionSchema = new mongoose.Schema<Condition>(
  {
    supplier_id: { type: mongoose.Types.ObjectId, ref: "supplier", required: true },
    season: { type: String, required: true },
    code: { type: String },
    company_name: { type: String },
    siret: { type: String },
    tva: { type: String },
    web_url: { type: String },
    email: { type: String },
    phone: { type: String },
    address_1: { type: String },
    address_2: { type: String },
    address_3: { type: String },
    city: { type: String },
    postal: { type: String },
    country: { type: String },
    comment: { type: String },
    tarif: { type: Number },
    contacts: [contactSchema],
    brand_id: [{ type: mongoose.Types.ObjectId, ref: "brand" }],
    status: { type: String },
    creator: {
      type: Map,
      of: String,
    },
    additional_fields: [
      {
        label: { type: String },
        value: { type: String },
        field_type: { type: String },
      },
    ],
    admin: { type: String },
    buyers: [buyerSchema],
  },
  { timestamps: true, collection: "condition" }
);

const ConditionModel: Model<Condition> = mongoose.model<Condition>(
  "condition",
  conditionSchema
);

export default ConditionModel;
