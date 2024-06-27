import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";

export interface Uvc extends Document {
    product_id: ObjectId,
    color: string,
    size: string,
    item_ids: ObjectId[]
    status: string
    additional_fields?: any

}

const uvcSchema = new mongoose.Schema<Uvc>({
    product_id: { type: mongoose.Types.ObjectId, ref: "product"},
    color: {type: String},
    size: {type: String},
    item_ids: [{type: mongoose.Types.ObjectId, ref: "item"}],
    status: {type: String},
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},  { timestamps: true, collection: "uvc" })


const UvcModel: Model<Uvc> = mongoose.model<Uvc>("uvc", uvcSchema);

export default UvcModel