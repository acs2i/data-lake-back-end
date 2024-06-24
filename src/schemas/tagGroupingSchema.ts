import mongoose, { Document, ObjectId } from "mongoose";


export interface TagGrouping extends Document {
    type?: string,
    level?: string[]
    creator_id?: ObjectId
    additional_fields?: any

}

const tagGroupingSchema = new mongoose.Schema<TagGrouping>({
    type: { type: String },
    level: [{ type: String }],
    creator_id: { type: mongoose.Types.ObjectId },
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }

}, { timestamps: true, collection: "tag_grouping"  })

const TagGroupingModel = mongoose.model<TagGrouping>("tag_grouping", tagGroupingSchema)
export default TagGroupingModel