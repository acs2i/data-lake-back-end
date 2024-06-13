import mongoose, { Document } from "mongoose"


interface Grouping extends Document {
    label: string
    group_strings: string[]
}

const groupingSchema = new mongoose.Schema<Grouping>({
    label: { type: String},
    group_strings: [{type: String}]
}, { timestamps: true, collection: "grouping"})

const GroupingModel = mongoose.model<Grouping>("grouping", groupingSchema)
export default GroupingModel