import mongoose, { Document,Model, ObjectId } from "mongoose";

export interface UpdateEntry {
  updated_at: Date;
  updated_by: string;
  changes: Record<string, any>;
  file_name?: string;
}


export interface Tax extends Document {
  code: number;
  label: string;
  rate: string;
  status: string;
  creator_id: ObjectId;
  last_modified_by: mongoose.Types.ObjectId;
  updates: UpdateEntry[]
}

const taxSchema = new mongoose.Schema<Tax>(
  {
    code: { type: Number },
    label: { type: String },
    rate: { type: String },
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
  { timestamps: true, collection: "tax" }
);

const TaxModel = mongoose.model<Tax>("tax", taxSchema);
export default TaxModel;
