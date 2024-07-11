import mongoose ,{ Document, Model, ObjectId} from "mongoose"

export interface Brand extends Document {
    code: string,
    label: string,
    user_field: string[],
    status: number,
    creator_id: ObjectId,
    additional_fields?: any
}


const brandSchema = new mongoose.Schema<Brand>({
    code: {
        type: String
    },
    label: {
        type: String
    },
    user_field: [{
        type: String
    }],
    status: {
        type: Number
    },
    creator_id: {
        type: mongoose.Types.ObjectId
    },
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
      }
},  { timestamps: true, collection: "brand" })

const BrandModel: Model<Brand> = mongoose.model<Brand>("brand", brandSchema);
export default BrandModel