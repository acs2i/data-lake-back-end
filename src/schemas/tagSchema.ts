import mongoose, { Document, ObjectId } from "mongoose";


export interface Tag extends Document {
    name: string
    level: string
    status: number
    creator_id: ObjectId
    additional_fields?: any

}

const tagSchema = new mongoose.Schema<Tag>({
    name: { type: String },
    status: { type: Number },
    level: { type: String },
    creator_id: { type: mongoose.Types.ObjectId },
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }

}, { timestamps: true, collection: "tag"  })

const TagModel = mongoose.model<Tag>("tag", tagSchema)
export default TagModel