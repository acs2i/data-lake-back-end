import mongoose, { Document, Model, ObjectId } from "mongoose";

export interface Dimension extends Document {
    code: string,
    label: string,
    type: string,
    status: string,
    creation_date: Date,
    modification_date: Date
    creator_id: ObjectId
    additional_fields?: any

}

const dimensionSchema = new mongoose.Schema<Dimension>({
    code: {type: String},
    label: { type: String },
    type: { type: String },
    status: { type: String },
    creator_id: { type: mongoose.Types.ObjectId},
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},  {     timestamps: { createdAt: 'creation_date', updatedAt: 'modification_date' }, collection: "dimension" })

const DimensionModel: Model<Dimension> = mongoose.model<Dimension>("dimension", dimensionSchema);
export default DimensionModel