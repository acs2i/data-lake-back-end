import mongoose, { Document, Model, ObjectId } from "mongoose";

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
  status: string;
}


const userFieldSchema = new mongoose.Schema<Field>({
  code: { type: Number},
  label: { type: String},
  apply_to: { type: String},
  additional_fields: [
    {
      field_type: { type: String},
      options: { type: [String] },
      value: { type: mongoose.Schema.Types.Mixed},
    },
  ],
  status: { type: String},
}, { timestamps: true, collection: "user-fields" });


const UserFieldModel: Model<Field> = mongoose.model<Field>("user-fields", userFieldSchema);

export default UserFieldModel;
