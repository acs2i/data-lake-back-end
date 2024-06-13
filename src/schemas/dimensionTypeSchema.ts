import mongoose, { Document, Model, ObjectId } from "mongoose";

interface DimensionType extends Document {
    type: string

}

const dimensionSchema = new mongoose.Schema<DimensionType>({
    type: { type: String },
},  { timestamps: true, collection: "dimension_type" })

const DimensionModel: Model<DimensionType> = mongoose.model<DimensionType>("dimension_type", dimensionSchema);
export default DimensionModel