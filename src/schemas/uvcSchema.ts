import mongoose, { Document, Model, Schema } from "mongoose";

interface Uvc extends Document {
    GA_ARTICLE: string,         // lié à product ga_article 
    GA_CHARLIBRE1: string | number, // pas de liason 
    GA_LIBELLE: string, // code de uvc, pas de liason? dupliqué ici, ainsi que "product Schema"
    GA_LIBCOMPL: string,        // 
    GA_POIDSBRUT: number,
    GA_LIBREART4: number,
    COULEUR: number,
    GA_LIBREART1: number,
    GA_LIBERART2: number,
    GA_CODEARTICLE: number,
    GA_COLLECTION: string,
    TAILLE: number,
    GA_FERME: string        // stand in for boolean: values can be "X" or "-"
}

const uvcSchema = new mongoose.Schema<Uvc>({
    GA_ARTICLE: { type: String},
    GA_CHARLIBRE1: {type : Schema.Types.Mixed },
    GA_LIBELLE: { type: String},
    GA_LIBCOMPL: { type: String},
    GA_POIDSBRUT: { type: Number},
    GA_LIBREART4: { type: Number},
    COULEUR: {type: Number},
    GA_LIBREART1: {type: Number},
    GA_LIBERART2: {type: Number},
    GA_CODEARTICLE: {type: Number},
    GA_COLLECTION: { type: String},
    TAILLE: {type: Number},
    GA_FERME: { type: String}  

},  { timestamps: true, collection: "uvc" })


const UvcModel: Model<Uvc> = mongoose.model<Uvc>("uvc", uvcSchema);

export default UvcModel;