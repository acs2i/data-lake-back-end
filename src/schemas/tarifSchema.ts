import mongoose, { Document, Model } from "mongoose";

export interface Tarif extends Document {
    code: number,
    label: string,
    additional_fields: any
}

const tarifSchema = new mongoose.Schema<Tarif>({
    code: {type: Number},
    label: {type: String},
    additional_fields: [{type: mongoose.Types.Map}]
}, { timestamps: true, collection: "tarif"})

const tarifModel: Model<Tarif> = mongoose.model<Tarif>("tarif", tarifSchema)

export default tarifModel
