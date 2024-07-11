import mongoose, { Document, Model, Schema } from "mongoose"

export interface DimensionType extends Document {
    dimension: string
}

const dimensionTypeSchema: Schema<DimensionType> = new mongoose.Schema<DimensionType>({
    dimension: { type: String }
}, { timestamps: true, collection: "dimension_type"})

const DimensionTypeModel : Model<DimensionType> = mongoose.model<DimensionType>("dimension_type", dimensionTypeSchema)

export default DimensionTypeModel