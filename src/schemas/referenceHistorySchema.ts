import mongoose, { Model, Schema } from "mongoose"
import { Reference } from "./referenceSchema"
import { ObjectId } from "mongodb";

interface ReferenceHistory {
    reference: Reference,
    newestVersionId: ObjectId
}

export const referenceHistorySchema = new mongoose.Schema<ReferenceHistory>({
    reference: {
        type: Schema.Types.Mixed,
        unique: true,
        required: true
    },
    newestVersionId: {
        type: Schema.Types.ObjectId,
        unique: false,
        required: true
    }
    
},{ collection: "referenceHistory", timestamps: true} )

const ReferenceHistoryModel: Model<ReferenceHistory> = mongoose.model("referenceHistory", referenceHistorySchema);

export default ReferenceHistoryModel