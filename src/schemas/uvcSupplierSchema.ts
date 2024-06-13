import mongoose, { Document, ObjectId, Schema } from "mongoose";


interface UvcSupplier extends Document {
    product_id: ObjectId,
    supplier_id: ObjectId,
    color: string,
    size: string
}

const uvcSupplierSchema = new mongoose.Schema<UvcSupplier>({
    product_id: { type: mongoose.Types.ObjectId },
    supplier_id: { type: mongoose.Types.ObjectId },
    color: { type: String, },
    size: { type: String, },
}, { timestamps: true, collection: "uvc"} )


const UvcSupplierModel = mongoose.model<UvcSupplier>("uvc_supplier", uvcSupplierSchema);
export default UvcSupplierModel