import mongoose, { Document, Schema } from "mongoose";


interface UvcSupplier extends Document {
    GA_ARTICLE: string,
    GA_FOURNPRINC: string | number,
    GA_CHARLIBRE: string | number,  
    GA_QPCBACH: number,
    GA_CODEARTICLE: number,
    COULEUR: number,
    TAILLE: number,
    GA_CHARLIBRE3: string,
}

const uvcSupplierSchema = new mongoose.Schema<UvcSupplier>({
    GA_ARTICLE: { type: String },
    GA_FOURNPRINC: { type: Schema.Types.Mixed },
    GA_CHARLIBRE: { type: Schema.Types.Mixed },
    GA_QPCBACH: { type: Number, },
    GA_CODEARTICLE: { type: Number, },
    COULEUR: { type: Number, },
    TAILLE: { type: Number, },
    GA_CHARLIBRE3: { type: String },
}, { timestamps: true, collection: "uvc"} )


const UvcSupplierModel = mongoose.model<UvcSupplier>("uvc_supplier", uvcSupplierSchema);
export default UvcSupplierModel