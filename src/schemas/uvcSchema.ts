import mongoose, { Date, Document, Model, ObjectId, Schema } from "mongoose";



interface Price {
    tarif_id: ObjectId,
    currency: string,
    supplier_id: ObjectId,
    price: number,
    store: string,
    timestampe: Date
}

export interface Uvc extends Document {
    dimensions: string[],
    prices: Price[]
    eans: string[],
    user_field: string[],
    status: number
    creator_id: ObjectId
}

const uvcSchema = new mongoose.Schema<Uvc>({
    dimensions: [{type: String}],
    prices: [{ type: Schema.Types.Mixed } ],
    eans: [{type: String}],
    user_field: [{type: String}],
    status: {type: Number},
    creator_id: { type: mongoose.Types.ObjectId},

},  { timestamps: true, collection: "uvc" })


const UvcModel: Model<Uvc> = mongoose.model<Uvc>("uvc", uvcSchema);

export default UvcModel