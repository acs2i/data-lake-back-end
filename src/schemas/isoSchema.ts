import mongoose, { Document, Model, ObjectId } from "mongoose";

// Interface pour UVC
export interface IsoCode extends Document {
    numeric: string;
    alpha2Code: string;
    alpha3Code: string;
    countryName: string
    //iso 1
    // iso 2
    // iso 3
    // nom du pays 
}
const isoCodeSchema = new mongoose.Schema<IsoCode>({
    countryName: { type: String },
    numeric: { type: String },
    alpha2Code: { type: String },
    alpha3Code: { type: String },

},  { timestamps: true, collection: "iso_code" }) 

const IsoModel: Model<IsoCode> = mongoose.model<IsoCode>("iso_code", isoCodeSchema);
export default IsoModel