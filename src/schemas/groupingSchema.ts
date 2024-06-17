import mongoose, { Document, ObjectId } from "mongoose"


interface Grouping extends Document {
    label: string
    group_strings: ObjectId[]
}

const groupingSchema = new mongoose.Schema<Grouping>({
    label: { type: String},
    group_strings: [{type: mongoose.Types.ObjectId, ref: "dimension_grid"}]
}, { timestamps: true, collection: "grouping"})

const GroupingModel = mongoose.model<Grouping>("grouping", groupingSchema)
export default GroupingModel