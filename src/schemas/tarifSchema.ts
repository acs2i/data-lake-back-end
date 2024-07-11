import mongoose, { Document, Model } from "mongoose";

export interface Tarif extends Document {
    code: number,
    label: string,
    user_field: string[]    
}

const tarifSchema = new mongoose.Schema<Tarif>({
    code: {type: Number},
    label: {type: String},
    user_field: [{type: String}]
}, { timestamps: true, collection: "tarif"})

const tarifModel: Model<Tarif> = mongoose.model<Tarif>("tarif", tarifSchema)

export default tarifModel
