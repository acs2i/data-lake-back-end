import mongoose, { Model, ObjectId, Schema } from "mongoose";
import { Product } from "./productSchema";
/*
Note:
    La raison d'avoir une autre collection pour les histoires de produit plutot que la meme collection
    est que: Si vous cherchez tous les produits par libelle, par exemple, vous ne voudrez que les versions actuelles, et pas les anciennes. 

    Avoir les anciennes versions dans une autre table permet aux serveur de ne pas s'occuper de differencier entre la courante et la ancienne.

*/

interface ProductHistory extends Product {
    GA_PARENT: ObjectId
}


const productHistorySchema = new mongoose.Schema<ProductHistory>({
    GA_CODEARTICLE: {
        type: Number,
    },
    GA_LIBCOMPL: {
        type: String
    },
    GA_LIBELLE: {
        type: String
    },
    GA_LIBREART1: { 
        type: Number,
    },
    GA_LIBREART2: {
        type: Number,
    },
    GA_LIBREART4: {
        type: Number,
    },
    GA_FOURNPRINC: {
        type: Number
    },
    GA_FERME: {
        type: String
    },
    GA_VERSION: {
        type: Number
    },
    GA_HISTORIQUE: [{
        type: Schema.Types.ObjectId
    }],
    GA_PARENT: {
        type: Schema.Types.ObjectId
    }
},  { timestamps: true, collection: "product_history" })

const ProductHistoryModel: Model<ProductHistory> = mongoose.model<ProductHistory>("product_history", productHistorySchema);
export default ProductHistoryModel;