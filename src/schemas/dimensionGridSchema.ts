import mongoose, { ObjectId } from "mongoose";

interface DimensionGrid {
    label: string, 
    type_id: ObjectId,
    creator_id: ObjectId
}

const dimensionGridSchema = new mongoose.Schema<DimensionGrid>({
    label: {
        type: String
    }, 
    type_id: {
        type: mongoose.Types.ObjectId,
        ref: "dimension_type"
    },
    creator_id: {
        type: mongoose.Types.ObjectId
    }
}, { timestamps: true, collection: "dimension_grid" })

const DimensionGridModel = mongoose.model<DimensionGrid>("dimension_grid", dimensionGridSchema)
export default DimensionGridModel