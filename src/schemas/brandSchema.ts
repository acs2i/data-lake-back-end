import mongoose ,{ Document, Model, ObjectId} from "mongoose"

export interface Brand extends Document {
    code: string,
    label: string,
    status: string,
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
    status: {
        type: String
    },
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
      }
},  {     timestamps: { createdAt: 'creation_date', updatedAt: 'modification_date' }, collection: "brand" })

const BrandModel: Model<Brand> = mongoose.model<Brand>("brand", brandSchema);
export default BrandModel