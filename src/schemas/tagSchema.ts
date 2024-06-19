import mongoose, { Document, ObjectId } from "mongoose";


export interface Tag extends Document {
    type: string
    code: string
    name: string
    tag_grouping_id: ObjectId
    parent_id?: ObjectId[]
    status: string
    creator_id: ObjectId
}

const tagSchema = new mongoose.Schema<Tag>({
    type: { type: String },
    code: { type: String },
    name: { type: String },
    status: { type: String },
    parent_id: [{ type: mongoose.Types.ObjectId , ref: "tag"}],
    tag_grouping_id: { type: mongoose.Types.ObjectId, ref: "tag_grouping" },
    creator_id: { type: mongoose.Types.ObjectId },

}, { timestamps: true, collection: "tag"  })

const TagModel = mongoose.model<Tag>("tag", tagSchema)
export default TagModel