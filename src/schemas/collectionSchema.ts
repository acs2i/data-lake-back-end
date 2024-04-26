import mongoose ,{ Document, Model, Schema} from "mongoose"

interface Collection extends Document {
    CODE: string  | number,
    LIBELLE: string | number,
}


const collectionSchema = new mongoose.Schema<Collection>({
    CODE: {
        type: Schema.Types.Mixed
    },
    LIBELLE: {
        type: Schema.Types.Mixed
    }
},   { timestamps: true, collection: "collection" })

const CollectionModel: Model<Collection> = mongoose.model<Collection>("collection", collectionSchema);
export default CollectionModel