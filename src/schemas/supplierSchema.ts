import mongoose, { Document, Model } from "mongoose";

export interface Supplier extends Document {
    code: string
    label: string,
    address: string,
    postal: string,
    country: string,
    status: string,
    creator: any,       // its an object
    additional_fields?: any

}

const supplierSchema = new mongoose.Schema<Supplier>({
    code: {type: String },
    label: { type: String},
    address: { type: String},
    postal: { type: String},
    country: { type: String},
    status: { type: String},
    creator: {
        type: Map,
        of: String
    },
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},{ timestamps: true, collection: "supplier" })

const SupplierModel: Model<Supplier> = mongoose.model<Supplier>("supplier", supplierSchema)

export default SupplierModel