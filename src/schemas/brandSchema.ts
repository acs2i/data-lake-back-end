import mongoose ,{ Document, Model} from "mongoose"

interface Brand extends Document {
    YX_CODE: string,
    YX_LIBELLE: string
}


const brandSchema = new mongoose.Schema<Brand>({

    YX_CODE: {
        type: String
    },
    YX_LIBELLE: {
        type: String
    }
},  { timestamps: true, collection: "brand" })

const BrandModel: Model<Brand> = mongoose.model<Brand>("brand", brandSchema);
export default BrandModel