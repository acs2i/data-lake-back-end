import mongoose, { Document, Model, ObjectId } from "mongoose";

export interface CustomField {
  field_name: string;
  field_type: string; 
  options?: string[];
  value: any;
}


export interface Field extends Document {
  creator_id: ObjectId;
  code: string;
  label: string;
  apply_to: string;
  additional_fields: CustomField[];
}


const userFieldSchema = new mongoose.Schema<Field>({
  creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true },
  label: { type: String, required: true },
  apply_to: { type: String, required: true },
  additional_fields: [
    {
      field_name: { type: String, required: true },
      field_type: { type: String, required: true },
      options: { type: [String] },
      value: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
}, { timestamps: true, collection: "user-fields" });


const UserFieldModel: Model<Field> = mongoose.model<Field>("user-fields", userFieldSchema);

export default UserFieldModel;
