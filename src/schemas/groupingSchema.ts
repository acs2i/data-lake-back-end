import mongoose, { Document, ObjectId } from "mongoose"


interface Grouping extends Document {
    label: string
    group_strings: ObjectId[]
    additionalFields?: any

}

const groupingSchema = new mongoose.Schema<Grouping>({
    label: { type: String},
    group_strings: [{type: mongoose.Types.ObjectId, ref: "dimension_grid"}],
    additional_fields {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true, collection: "grouping"})

const GroupingModel = mongoose.model<Grouping>("grouping", groupingSchema)
export default GroupingModel