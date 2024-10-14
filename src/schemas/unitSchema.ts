import mongoose, { Document, ObjectId } from "mongoose";

export interface Unit extends Document {
    name: string;
    unit: string;
    apply_to: string;
}

const unitSchema = new mongoose.Schema<Unit>({
    name: { type: String },
    unit: { type: String },
    apply_to: { type: String },
}, { timestamps: true, collection: "unit" });

const UnitModel = mongoose.model<Unit>("unit", unitSchema);
export default UnitModel;
