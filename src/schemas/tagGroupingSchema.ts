import mongoose, { Document, ObjectId } from "mongoose";


interface TagGrouping extends Document {
    type?: string,
    level?: string[]
    creator_id?: ObjectId
}

const tagGroupingSchema = new mongoose.Schema<TagGrouping>({
    type: { type: String },
    level: [{ type: String }],
    creator_id: { type: mongoose.Types.ObjectId },

}, { timestamps: true, collection: "tag_grouping"  })

const TagGroupingModel = mongoose.model<TagGrouping>("tag_grouping", tagGroupingSchema)
export default TagGroupingModel