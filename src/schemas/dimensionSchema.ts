import mongoose, { Document, Model } from "mongoose";

interface Dimension extends Document {
    GDI_TYPEDIM: string,
    GDI_DIMORI: string,
    GDI_LIBELLE: string
}

const dimensionSchema = new mongoose.Schema<Dimension>({
    GDI_TYPEDIM: { type: String },
    GDI_DIMORI:{type: String},
    GDI_LIBELLE: {type: String}
},  { timestamps: true, collection: "dimension" })

const DimensionModel: Model<Dimension> = mongoose.model<Dimension>("dimension", dimensionSchema);
export default DimensionModel