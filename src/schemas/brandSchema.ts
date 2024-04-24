import mongoose ,{ Document, Model, ObjectId, Schema} from "mongoose"

interface Brand extends Document {
    YX_CODE: string,
    YX_LIBELLE: string
    CREATOR_ID: ObjectId
}


const brandSchema = new mongoose.Schema<Brand>({
    CREATOR_ID: {
        type: Schema.Types.ObjectId
    },
    YX_CODE: {
        type: String
    },
    YX_LIBELLE: {
        type: String
    }
},  { timestamps: true, collection: "brand" })

const BrandModel: Model<Brand> = mongoose.model<Brand>("brand", brandSchema);
export default BrandModel