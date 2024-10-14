import mongoose, { Document } from "mongoose"


export interface DimensionGrid extends Document{
    label: string,
    code: string,
    type: string,
    dimensions: string[]
    frn_labels: string[],
    status: string;
}

const dimensionGridSchema = new mongoose.Schema<DimensionGrid>({
    label: { type: String },
    code: { type: String },
    type: {type: String},
    dimensions: [{ type: String }],
    frn_labels: [{ type: String }],
    status: {type: String},
}, { timestamps: { createdAt: 'creation_date', updatedAt: 'modification_date' }, collection: "dimension_grid"})


const DimensionGridModel = mongoose.model<DimensionGrid>("dimension_grid",dimensionGridSchema )

export default DimensionGridModel