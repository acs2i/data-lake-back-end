import mongoose, { Document,Model, ObjectId } from "mongoose";

export interface Tag extends Document {
  code: string;
  name: string;
  level: string;
  tag_grouping_id: ObjectId;
  status: string;
  additional_fields?: any;
  creator_id: ObjectId;
}

const tagSchema = new mongoose.Schema<Tag>(
  {
    code: { type: String },
    name: { type: String },
    status: { type: String },
    level: { type: String },
    tag_grouping_id: {
      type: mongoose.Types.ObjectId,
      ref: "tag_grouping",
    },
    additional_fields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    creator_id: { type: mongoose.Types.ObjectId },
  },
  {     timestamps: { createdAt: 'creation_date', updatedAt: 'modification_date' },   collection: "tag" }
);

const TagModel = mongoose.model<Tag>("tag", tagSchema);
export default TagModel;
