import mongoose, { Document, Model, Schema } from "mongoose";

export interface Uvc extends Document {
    GA_ARTICLE: string,         // lié à product ga_article 
    GA_CHARLIBRE1: string, // pas de liason 
    GA_LIBELLE: string, // code de uvc, pas de liason? dupliqué ici, ainsi que "product Schema"
    GA_LIBCOMPL: string,        // 
    GA_POIDSBRUT: string,
    GA_LIBREART4: string,
    COULEUR: string,
    GA_LIBREART1: string,
    GA_LIBERART2: string,
    GA_CODEARTICLE: string,
    GA_COLLECTION: string,
    TAILLE: string,
    GA_FERME: string        // stand in for boolean: values can be "X" or "-"
}

const uvcSchema = new mongoose.Schema<Uvc>({
    GA_ARTICLE: { type: String},
    GA_CHARLIBRE1: {type : Schema.Types.Mixed },
    GA_LIBELLE: { type: String},
    GA_LIBCOMPL: { type: String},
    GA_POIDSBRUT: { type: String},
    GA_LIBREART4: { type: String},
    COULEUR: {type: String},
    GA_LIBREART1: {type: String},
    GA_LIBERART2: {type: String},
    GA_CODEARTICLE: {type: String},
    GA_COLLECTION: { type: String},
    TAILLE: {type: String},
    GA_FERME: { type: String}  

},  { timestamps: true, collection: "uvc" })


const UvcModel: Model<Uvc> = mongoose.model<Uvc>("uvc", uvcSchema);

export default UvcModel;