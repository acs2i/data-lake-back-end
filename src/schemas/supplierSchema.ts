import mongoose, { Document, Model, ObjectId } from "mongoose";

interface Contact {
  firstname: string;
  lastname: string;
  function: string;
  phone: string;
  mobile: string;
  email: string;
}

interface Condition {
  tarif: string;
  currency: string;
  rfa: string;
  net_price: string;
  labeling: string;
  paiement_condition: string;
  franco: string;
  validate_tarif: string;
  budget: string;
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
  postal: string;
  country: string;
  contacts?: Contact[];
  conditions?: Condition[];
  brand_id: ObjectId[];
  status: string;
  creator: any; // it's an object
  additional_fields?: any;
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

const conditionSchema = new mongoose.Schema(
  {
    tarif: { type: String },
    currency: { type: String },
    rfa: { type: String },
    net_price: { type: String },
    labeling: { type: String },
    paiement_condition: { type: String },
    franco: { type: String },
    validate_tarif: { type: String },
    budget: { type: String },
  },
  { _id: false }
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
    contacts: [contactSchema],
    conditions: [conditionSchema],
    brand_id: [{type: mongoose.Types.ObjectId, ref: "brand"}],
    status: { type: String },
    creator: {
      type: Map,
      of: String,
    },
    additional_fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true, collection: "supplier" }
);

const SupplierModel: Model<Supplier> = mongoose.model<Supplier>(
  "supplier",
  supplierSchema
);

export default SupplierModel;
