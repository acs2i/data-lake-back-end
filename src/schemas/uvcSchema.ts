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
    status: number
    creator_id: ObjectId
    additional_fields: any
}

const uvcSchema = new mongoose.Schema<Uvc>({
    dimensions: [{type: String}],
    prices: [{ type: Schema.Types.Mixed } ],
    eans: [{type: String}],
    status: {type: Number},
    creator_id: { type: mongoose.Types.ObjectId},
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
      }

},  { timestamps: true, collection: "uvc" })


const UvcModel: Model<Uvc> = mongoose.model<Uvc>("uvc", uvcSchema);

export default UvcModel