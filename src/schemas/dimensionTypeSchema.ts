import mongoose, { Document, Model, ObjectId } from "mongoose";

interface DimensionType extends Document {
    type: string
    additionalFields?: any

}

const dimensionSchema = new mongoose.Schema<DimensionType>({
    type: { type: String},
    additional_fields {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},  { timestamps: true, collection: "dimension_type" })

const DimensionTypeModel: Model<DimensionType> = mongoose.model<DimensionType>("dimension_type", dimensionSchema);
export default DimensionTypeModel