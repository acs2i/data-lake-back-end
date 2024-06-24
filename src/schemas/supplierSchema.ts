import mongoose, { Document, Model } from "mongoose";

export interface Supplier extends Document {
    code: string
    label: string,
    juridique: string,
    status: string,            // just a boolean that determines if true or false, possible values are: "+" , "-"
                                // created a variable field to store addresses
    additionalFields?: any

}

const supplierSchema = new mongoose.Schema<Supplier>({
    code: {type: String },
    label: { type: String},
    juridique: { type: String},
    status: { type: String},           
    additional_fields {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},{ timestamps: true, collection: "supplier" })

const SupplierModel: Model<Supplier> = mongoose.model<Supplier>("supplier", supplierSchema)

export default SupplierModel