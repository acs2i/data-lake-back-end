import mongoose ,{ Document, Model, ObjectId} from "mongoose"

export interface Collection extends Document {
    code: string ,
    label: string,
    status: string,
    creator_id: ObjectId
    additional_fields?: any

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
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},   {     timestamps: { createdAt: 'creation_date', updatedAt: 'modification_date' }, collection: "collection" })

const CollectionModel: Model<Collection> = mongoose.model<Collection>("collection", collectionSchema);
export default CollectionModel