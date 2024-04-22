import mongoose, { Document } from "mongoose";


interface Access extends Document {
    CLE_CHIFFRE: string,
    NOM: string
}


const accessSchema = new mongoose.Schema<Access>({
    CLE_CHIFFRE: { type: String},
    NOM: { type: String}
}, { timestamps: true, collection: "access" })


const AccessModel = mongoose.model("access", accessSchema);

export default AccessModel;