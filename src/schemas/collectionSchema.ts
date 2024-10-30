import mongoose ,{ Document, Model, ObjectId} from "mongoose"

export interface UpdateEntry {
    updated_at: Date;
    updated_by: string;
    changes: Record<string, any>;
    file_name?: string;
  }

  
export interface Collection extends Document {
    code: string ,
    label: string,
    status: string,
    creator_id: ObjectId
    last_modified_by: mongoose.Types.ObjectId;
    additional_fields?: any
    updates: UpdateEntry[];
}


const collectionSchema = new mongoose.Schema<Collection>({
    code: {
        type: String
    },
    label: {
        type: String
    },
    status: {
        type: String
    },
    creator_id: {
        type: mongoose.Types.ObjectId
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
},   {     timestamps: { createdAt: 'creation_date', updatedAt: 'modification_date' }, collection: "collection" })

const CollectionModel: Model<Collection> = mongoose.model<Collection>("collection", collectionSchema);
export default CollectionModel