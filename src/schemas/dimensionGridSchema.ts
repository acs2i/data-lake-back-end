import mongoose, { Document } from "mongoose"


export interface DimensionGrid extends Document{
    label: string,
    type: string,
    dimensions: string[]
}

const dimensionGridSchema = new mongoose.Schema<DimensionGrid>({
    label: { type: String },
    type: {type: String},
    dimensions: [{ type: String }]
}, {timestamps: true, collection: "dimension_grid"})


const DimensionGridModel = mongoose.model<DimensionGrid>("dimension_grid",dimensionGridSchema )

export default DimensionGridModel