import mongoose, { Document, Model, ObjectId } from "mongoose";

export interface UpdateEntry {
  updated_at: Date;
  updated_by: string;
  changes: Record<string, any>;
  file_name?: string;
}

export interface CustomField {
  field_type: string;
  options?: string[];
  value: any;
}

export interface Field extends Document {
  code: number;
  label: string;
  apply_to: string;
  additional_fields: CustomField[];
  last_modified_by: mongoose.Types.ObjectId;
  updates: UpdateEntry[]
  status: string;
}

const userFieldSchema = new mongoose.Schema<Field>(
  {
    code: { type: Number },
    label: { type: String },
    apply_to: { type: String },
    last_modified_by: { type: mongoose.Schema.Types.ObjectId },
    updates: [
      {
        updated_at: { type: Date },
        updated_by: { type: String },
        changes: { type: Map, of: mongoose.Schema.Types.Mixed },
        file_name: { type: String },

      },
    ],
    additional_fields: [
      {
        field_type: { type: String },
        options: { type: [String] },
        value: { type: mongoose.Schema.Types.Mixed },
        default_value: { type: mongoose.Schema.Types.Mixed },
      },
    ],
    status: { type: String },
  },
  { timestamps: true, collection: "user-fields" }
);

const UserFieldModel: Model<Field> = mongoose.model<Field>(
  "user-fields",
  userFieldSchema
);

export default UserFieldModel;
