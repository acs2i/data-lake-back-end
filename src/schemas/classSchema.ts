 import mongoose, { Document, ObjectId } from "mongoose";


interface Class extends Document {
    type: string
    code: string
    name: string
    classification_id: ObjectId
    parent_id?: ObjectId[]
    status: string
    creator_id: ObjectId
}

const classSchema = new mongoose.Schema<Class>({
    type: { type: String },
    code: { type: String },
    name: { type: String },
    status: { type: String },
    parent_id: [{ type: mongoose.Types.ObjectId }],
    classification_id: { type: mongoose.Types.ObjectId },
    creator_id: { type: mongoose.Types.ObjectId },

}, { timestamps: true, collection: "class"  })

const ClassModel = mongoose.model<Class>("class", classSchema)
export default ClassModel