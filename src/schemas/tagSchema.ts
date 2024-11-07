import mongoose, { Document } from "mongoose";

export interface UpdateEntry {
  updated_at: Date;
  updated_by: string;
  changes: Record<string, any>;
  file_name?: string;
}

export interface Tag extends Document {
  code: string;
  name: string;
  level: string;
  tag_grouping_id: mongoose.Types.ObjectId;
  status: string;
  additional_fields?: any;
  last_modified_by: mongoose.Types.ObjectId;
  creation_date: Date;
  modification_date: Date;
  updates: UpdateEntry[];
}

const tagSchema = new mongoose.Schema<Tag>(
  {
    code: { type: String },
    name: { type: String },
    status: { type: String },
    level: { type: String },
    tag_grouping_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tag_grouping",
    },
    additional_fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
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
  {
    timestamps: { createdAt: "creation_date", updatedAt: "modification_date" },
    collection: "tag",
  }
);

const TagModel = mongoose.model<Tag>("tag", tagSchema);
export default TagModel;
