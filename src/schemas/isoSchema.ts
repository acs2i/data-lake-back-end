import mongoose, { Document, Model, ObjectId } from "mongoose";

// Interface pour UVC
export interface IsoSchema extends Document {
    code: string;
}
const isoCodeSchema = new mongoose.Schema<IsoSchema>({
    code: { type: String }
},  { timestamps: true, collection: "iso_code" }) 

const IsoModel: Model<IsoSchema> = mongoose.model<IsoSchema>("iso_code", isoCodeSchema);
export default IsoModel