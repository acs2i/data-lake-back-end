import mongoose ,{ Document, Model, Schema} from "mongoose"

interface Collection extends Document {
    YX_CODE: string  | number,
    YX_LIBELLE: string | number
}


const collectionSchema = new mongoose.Schema<Collection>({

    YX_CODE: {
        type: Schema.Types.Mixed
    },
    YX_LIBELLE: {
        type: Schema.Types.Mixed
    }
},   { timestamps: true, collection: "collection" })

const CollectionModel: Model<Collection> = mongoose.model<Collection>("collection", collectionSchema);
export default CollectionModel