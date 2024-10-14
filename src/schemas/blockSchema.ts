import mongoose, { Document,Model, ObjectId } from "mongoose";

export interface Block extends Document {
  code: number;
  label: string;
  status: string;
  creator_id: ObjectId;
}

const blockSchema = new mongoose.Schema<Block>(
  {
    code: { type: Number },
    label: { type: String },
    status: { type: String },
    creator_id: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true, collection: "block" }
);

const BlockModel = mongoose.model<Block>("block", blockSchema);
export default BlockModel;
