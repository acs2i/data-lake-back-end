import mongoose ,{ Document, Model, Schema} from "mongoose"

interface Brand extends Document {
    YX_CODE: number,
    YX_LIBELLE: string | number
}


const brandSchema = new mongoose.Schema<Brand>({

    YX_CODE: {
        type: Number
    },
    YX_LIBELLE: {
        type: Schema.Types.Mixed
    }
},  { timestamps: true, collection: "brand" })

const BrandModel: Model<Brand> = mongoose.model<Brand>("brand", brandSchema);
export default BrandModel