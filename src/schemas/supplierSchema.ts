import mongoose, { Model } from "mongoose"

interface Supplier {
    k: string,  // linked to the  frn in uvc 
    v: string,
    address: string[],
    name: string,
}

const supplierSchema = new mongoose.Schema<Supplier>({
    k: {
        type: String,
        unique: false,
        required: false
    },
    v: {
        type: String,
        unique: false,
        required: false
    },
    name: {
        type: String,
        unique: false,
        required: false
    },
    address: {
        type: [String],
        required: false,
        unique: false
    }

},{ collection: "supplier", timestamps: true} )


const SupplierModel: Model<Supplier> = mongoose.model("supplier", supplierSchema)

export default SupplierModel;
