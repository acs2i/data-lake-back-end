import mongoose, { Document, Model, ObjectId } from "mongoose";

export interface Dimension extends Document {
    dimension_type_id: ObjectId,
    label: string,
    creator_id: ObjectId,

}

const dimensionSchema = new mongoose.Schema<Dimension>({
    dimension_type_id: { type: mongoose.Types.ObjectId, ref: "dimension_type" },
    label: { type: String },
    creator_id: { type: mongoose.Types.ObjectId}
},  { timestamps: true, collection: "dimension" })

const DimensionModel: Model<Dimension> = mongoose.model<Dimension>("dimension", dimensionSchema);
export default DimensionModel