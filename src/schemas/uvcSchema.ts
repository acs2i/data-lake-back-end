import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

export interface Uvc extends Document {
    product_id: ObjectId,
    color: string,
    size: string,
    item_ids: ObjectId[]
    status: string
    additionalFields?: any

}

const uvcSchema = new mongoose.Schema<Uvc>({
    product_id: { type: mongoose.Types.ObjectId},
    color: {type: String},
    size: {type: String},
    item_ids: [{type: mongoose.Types.ObjectId}],
    status: {type: String},
    additionalFields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},  { timestamps: true, collection: "uvc" })


const UvcModel: Model<Uvc> = mongoose.model<Uvc>("uvc", uvcSchema);

export default UvcModel