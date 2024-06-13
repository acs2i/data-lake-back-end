import mongoose, { Document, ObjectId } from "mongoose";


interface Classification extends Document {
    type: string,
    level: string[]
    creator_id: ObjectId
}

const classificationSchema = new mongoose.Schema<Classification>({
    type: { type: String },
    level: [{ type: String }],
    creator_id: { type: mongoose.Types.ObjectId },

}, { timestamps: true, collection: "classification"  })

const ClassificationModel = mongoose.model<Classification>("classification", classificationSchema)
export default ClassificationModel