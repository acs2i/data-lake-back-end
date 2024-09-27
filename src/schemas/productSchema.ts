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
    name: string;
    short_label: string;
    long_label: string;
    type: string;
    tag_ids: ObjectId[];
    tax: number;
    peau: number;
    tbeu_pb: number;
    tbeu_pmeu: number;
    height: string;
    width: string;
    long: string;
    comment: string;
    size_unit: string;
    weigth_unit: string;
    weight: string;
    weight_brut: string;
    weight_net: string;
    suppliers: SupplierSchema[];
    dimension_types: string[];
    uvc_ids: ObjectId[];
    brand_ids: ObjectId[];
    collection_ids: ObjectId[];
    imgPath: string;
    status: string;
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
    name: { type: String },
    short_label: { type: String },
    long_label: { type: String },
    type: { type: String },
    tag_ids: [{ type: mongoose.Types.ObjectId, ref: "tag" }],
    suppliers: [supplierSchema],
    dimension_types: [{ type: String }],
    tax: {type: Number},
    peau: { type: Number },
    tbeu_pb: { type: Number },
    tbeu_pmeu: { type: Number },
    height: {type: String},
    width: {type: String},
    long: {type: String},
    size_unit: {type: String},
    weigth_unit: {type: String},
    weight: {type: String},
    weight_brut: {type: String},
    weight_net: {type: String},
    comment: { type: String, maxlength: 3000 },
    uvc_ids: [{ type: mongoose.Types.ObjectId, ref: "uvc" }],
    brand_ids: [{ type: mongoose.Types.ObjectId, ref: "brand" }],
    collection_ids: [{ type: mongoose.Types.ObjectId, ref: "collection" }],
    imgPath: { type: String },
    status: { type: String, default: "A" },
    additional_fields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true, collection: "product" });

const ProductModel: Model<Product> = mongoose.model<Product>("product", productSchema);
export default ProductModel;
