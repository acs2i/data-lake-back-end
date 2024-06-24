import mongoose ,{ Document, Model, ObjectId, Schema} from "mongoose"

export interface Collection extends Document {
    code: string ,
    label: string,
    creator_id: ObjectId
    additionalFields?: any

}


const collectionSchema = new mongoose.Schema<Collection>({
    code: {
        type: Schema.Types.Mixed
    },
    label: {
        type: Schema.Types.Mixed
    },
    creator_id: {
        type: mongoose.Types.ObjectId
    },
    additional_fields {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},   { timestamps: true, collection: "collection" })

const CollectionModel: Model<Collection> = mongoose.model<Collection>("collection", collectionSchema);
export default CollectionModel