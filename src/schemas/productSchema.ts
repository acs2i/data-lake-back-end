import mongoose ,{ Document, Model, Schema} from "mongoose"
import { ObjectId } from "mongoose";

export interface Product extends Document {
    GA_CODEARTICLE: number,     // lié à la collection "UVC" sur la clé "ga_codearticle"
    GA_LIBCOMPL: string,       // dupliqué ioci ainsi que uvc schema..
    GA_LIBELLE: string,     // dupliqué ici, ainsi que "uvc Schema"
    GA_LIBREART1 : number,  // lié  à la famille
    GA_LIBREART2 : number, // c'est la famille qui concatené avec la sous famille, puis il est utilisé pour fetcher la valeur dans le collection FAMILY
    GA_LIBREART4 : number, // c'est une valeur qui lie à collection BRAND, et dans la collection BRAND, YX_CODE lie avec celle-ci.
    GA_FOURNPRINC: number, // lié à la collection "SUPPLIER" sur la clé "t_tiers"
    GA_FERME: string,       // acts as a boolean, either "X" or "-" BIG X
    GA_VERSION?: number,
    GA_HISTORIQUE?: ObjectId
}



const productSchema = new mongoose.Schema<Product>({
    GA_CODEARTICLE: {
        type: Number,
    },
    GA_LIBCOMPL: {
        type: String
    },
    GA_LIBELLE: {
        type: String
    },
    GA_LIBREART1: { // 21 galibreart1 <-> YXCODE 21 
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
    // GA_HISTORIQUE which will be added 
    GA_HISTORIQUE: [{
        type: Schema.Types.ObjectId
    }]
},  { timestamps: true, collection: "product" })


const ProductModel: Model<Product> = mongoose.model<Product>("product", productSchema);
export default ProductModel;