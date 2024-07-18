import mongoose, { Document, ObjectId } from "mongoose";


export interface TagGrouping extends Document {
    name: string
    level: string[]
    status: string
    additional_fields?: any
    creator_id: ObjectId

}

const tagGroupingSchema = new mongoose.Schema<TagGrouping>({
    name: { type: String },
    level: [{ type: String }],
    status: { type: String },
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    creator_id: { type: mongoose.Types.ObjectId }

}, { timestamps: true, collection: "tag_grouping"  })

const TagGroupingModel = mongoose.model<TagGrouping>("tag_grouping", tagGroupingSchema)
export default TagGroupingModel