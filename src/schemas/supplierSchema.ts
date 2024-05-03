import mongoose, { Document, Model } from "mongoose";

export interface Supplier extends Document {
    T_TIERS: number,
    T_LIBELLE: string,
    T_JURIDIQUE: string,
    T_FERME: string,            // just a boolean that determines if true or false, possible values are: "+" , "-"
    T_TELEPHONE: string,
    T_EMAIL: string
}

const supplierSchema = new mongoose.Schema<Supplier>({
    T_TIERS: {type: Number},
    T_LIBELLE: { type: String},
    T_JURIDIQUE: { type: String},
    T_FERME: { type: String},           
    T_TELEPHONE: { type: String},
    T_EMAIL: { type: String}
},{ timestamps: true, collection: "supplier" })

const SupplierModel: Model<Supplier> = mongoose.model<Supplier>("supplier", supplierSchema)

export default SupplierModel