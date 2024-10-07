import mongoose, { Document,Model, ObjectId } from "mongoose";

export interface Tax extends Document {
  code: number;
  label: string;
  rate: string;
  status: string;
  creator_id: ObjectId;
}

const taxSchema = new mongoose.Schema<Tax>(
  {
    code: { type: Number },
    label: { type: String },
    rate: { type: String },
    status: { type: String },
    creator_id: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true, collection: "tax" }
);

const TaxModel = mongoose.model<Tax>("tax", taxSchema);
export default TaxModel;
