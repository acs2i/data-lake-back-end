import mongoose ,{ Document, Model, ObjectId} from "mongoose"

export interface UpdateEntry {
    updated_at: Date;
    updated_by: string;
    changes: Record<string, any>;
    file_name?: string;
  }

export interface Brand extends Document {
    code: string,
    label: string,
    status: string,
    creator_id: ObjectId,
    last_modified_by: mongoose.Types.ObjectId;
    additional_fields?: any
    updates: UpdateEntry[]
}


const brandSchema = new mongoose.Schema<Brand>({
    code: {
        type: String
    },
    label: {
        type: String,
    },
    status: {
        type: String
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
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
      }
},  {     timestamps: { createdAt: 'creation_date', updatedAt: 'modification_date' }, collection: "brand" })

const BrandModel: Model<Brand> = mongoose.model<Brand>("brand", brandSchema);
export default BrandModel