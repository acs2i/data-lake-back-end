import mongoose, { Document, ObjectId } from "mongoose";


export interface Tag extends Document {
    name: string
    level: string
    status: number
    additional_fields?: any
    creator_id: ObjectId

}

const tagSchema = new mongoose.Schema<Tag>({
    name: { type: String },
    status: { type: Number },
    level: { type: String },
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    creator_id: { type: mongoose.Types.ObjectId }

}, { timestamps: true, collection: "tag"  })

const TagModel = mongoose.model<Tag>("tag", tagSchema)
export default TagModel