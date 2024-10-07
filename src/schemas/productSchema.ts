import mongoose, { Document, Model, ObjectId } from "mongoose";

// Interface pour SupplierSchema
interface SupplierSchema {
    supplier_id: ObjectId;  // ID du fournisseur
    supplier_ref: string;   // Référence du fournisseur
    pcb: string;            // PCB
    custom_cat: string;     // Catégorie douanière
    made_in: string;        // Pays d'origine
}

// Interface pour Product
export interface Product extends Document {
    creator_id: ObjectId;
    reference: string;
    alias: string;
    short_label: string;
    long_label: string;
    type: string;
    tag_ids: ObjectId[];
    peau: number;
    tbeu_pb: number;
    tbeu_pmeu: number;
    suppliers: SupplierSchema[];
    dimension_types: string[];
    uvc_ids: ObjectId[];
    brand_ids: ObjectId[];
    collection_ids: ObjectId[];
    imgPath: string;
    status: string;
    weight_measure_unit: string,
    net_weight: string,
    dimension_measure_unit: string,
    height: string,
    length: number,
    width: number,
    taxcode: number
    blocked: string,
    blocked_reason_code: string,
    coulfour: string,
    visible_on_internet: string,
    sold_on_internet: string,
    seuil_internet: string,
    en_reassort: string,
    remisegenerale: string    // jake, is this a string
    fixation: string,
    ventemetre: string,
    comment: string
    gross_weight: string,
    additional_fields: any;
}

// Définition du sous-schéma pour les fournisseurs
const supplierSchema = new mongoose.Schema<SupplierSchema>({
    supplier_id: { type: mongoose.Types.ObjectId, ref: "supplier" },
    supplier_ref: { type: String, default: "" },
    pcb: { type: String, default: "" },
    custom_cat: { type: String, default: "" },
    made_in: { type: String, default: "" },
}, { _id: false });

// Définition du schéma pour les produits
const productSchema = new mongoose.Schema<Product>({
    creator_id: { type: mongoose.Types.ObjectId, ref: "user" },
    reference: { type: String },
    alias: { type: String },
    short_label: { type: String },
    long_label: { type: String },
    type: { type: String },
    tag_ids: [{ type: mongoose.Types.ObjectId, ref: "tag" }],
    suppliers: [supplierSchema],  // Utilisation du schéma Supplier
    dimension_types: [{ type: String }],
    peau: { type: Number },
    tbeu_pb: { type: Number },
    tbeu_pmeu: { type: Number },
    uvc_ids: [{ type: mongoose.Types.ObjectId, ref: "uvc" }],
    brand_ids: [{ type: mongoose.Types.ObjectId, ref: "brand" }],
    collection_ids: [{ type: mongoose.Types.ObjectId, ref: "collection" }],
    imgPath: { type: String },
    status: { type: String, default: "A" },
    weight_measure_unit: { type: String},
    net_weight: { type: String},
    gross_weight: { type: String},

    dimension_measure_unit: { type: String},
    height: { type: String},
    length: { type: Number},
    width: { type: Number},
    taxcode: { type: Number},
    blocked: {type: String},
    blocked_reason_code: {type: String},
    coulfour: {type: String},
    visible_on_internet: {type : String},
    sold_on_internet: {type : String},
    seuil_internet: {type : String},
    en_reassort: {type : String},
    remisegenerale: {type : String},
    fixation: {type : String},
    ventemetre: {type : String},
    comment: {type : String},
    additional_fields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true, collection: "product" });

const ProductModel: Model<Product> = mongoose.model<Product>("product", productSchema);
export default ProductModel;
