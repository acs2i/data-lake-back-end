import mongoose ,{ Document, Model, ObjectId} from "mongoose"

export interface Brand extends Document {
    code: string,
    label: string
    creator_id: ObjectId,
    additionalFields?: any
}


const brandSchema = new mongoose.Schema<Brand>({
    code: {
        type: String
    },
    label: {
        type: String
    },
    creator_id: {
        type: mongoose.Types.ObjectId
    },
    additional_fields {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      }
},  { timestamps: true, collection: "brand" })

const BrandModel: Model<Brand> = mongoose.model<Brand>("brand", brandSchema);
export default BrandModel