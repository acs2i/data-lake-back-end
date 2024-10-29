import mongoose, { Document, Model, ObjectId } from "mongoose";

export interface UpdateEntry {
  updated_at: Date;
  updated_by: string;
  changes: Record<string, any>;
  file_name?: string;
}

export interface Dimension extends Document {
  code: string;
  label: string;
  type: string;
  status: string;
  creation_date: Date;
  modification_date: Date;
 
  additional_fields?: any;
  updates: UpdateEntry[];
}

const dimensionSchema = new mongoose.Schema<Dimension>(
  {
    code: { type: String },
    label: { type: String },
    type: { type: String },
    status: { type: String },
 
    additional_fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    updates: [
      {
        updated_at: { type: Date },
        updated_by: { type: String },
        changes: { type: Map, of: mongoose.Schema.Types.Mixed },
        file_name: { type: String },
      },
    ],
  },
  {
    timestamps: { createdAt: "creation_date", updatedAt: "modification_date" },
    collection: "dimension",
  }
);

const DimensionModel: Model<Dimension> = mongoose.model<Dimension>(
  "dimension",
  dimensionSchema
);
export default DimensionModel;
