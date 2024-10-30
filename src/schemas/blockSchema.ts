import mongoose, { Document,Model, ObjectId } from "mongoose";


export interface UpdateEntry {
  updated_at: Date;
  updated_by: string;
  changes: Record<string, any>;
  file_name?: string;
}

export interface Block extends Document {
  code: number;
  label: string;
  status: string;
  creator_id: ObjectId;
  last_modified_by: mongoose.Types.ObjectId;
  updates: UpdateEntry[];
}

const blockSchema = new mongoose.Schema<Block>(
  {
    code: { type: Number },
    label: { type: String },
    status: { type: String },
    creator_id: { type: mongoose.Types.ObjectId },
    last_modified_by: { type: mongoose.Schema.Types.ObjectId },
    updates: [
      {
        updated_at: { type: Date },
        updated_by: { type: String },
        changes: { type: Map, of: mongoose.Schema.Types.Mixed },
        file_name: { type: String },
      },
    ],
  },
  { timestamps: true, collection: "block" }
);

const BlockModel = mongoose.model<Block>("block", blockSchema);
export default BlockModel;
