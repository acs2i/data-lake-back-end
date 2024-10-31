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

export interface Supplier extends Document {
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
  comment: string;
  tarif: number;
  postal: string;
  country: string;
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
);


const supplierSchema = new mongoose.Schema<Supplier>(
  {
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
    comment: { type: String},
    tarif: { type: Number},
    contacts: [contactSchema],
    brand_id: [{type: mongoose.Types.ObjectId, ref: "brand"}],
    status: { type: String },
    creator: {
      type: Map,
      of: String,
    },
    additional_fields: [
      {
        label: { type: String},
        value: { type: String},
        field_type: { type: String},
      },
    ],
    admin: {type: String},
    buyers: [buyerSchema],
  },
  { timestamps: { createdAt: 'creation_date', updatedAt: 'modification_date' }, collection: "supplier" }
);

const SupplierModel: Model<Supplier> = mongoose.model<Supplier>(
  "supplier",
  supplierSchema
);

export default SupplierModel;
