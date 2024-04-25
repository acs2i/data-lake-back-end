import mongoose ,{ Document, Model, Schema} from "mongoose"
import { ObjectId } from "mongoose";
import { Uvc } from "./uvcSchema";
import { Family } from "./familySchema";
import { Brand } from "./brandSchema";

export interface Product extends Document {
    GA_CODEARTICLE: string,     // lié à la collection "UVC" sur la clé "ga_codearticle"
    GA_LIBCOMPL: string,       // dupliqué ioci ainsi que uvc schema..
    GA_LIBELLE: string,     // dupliqué ici, ainsi que "uvc Schema"
    GA_LIBREART1 : string,  // lié  à la famille
    GA_LIBREART2 : string, // c'est la famille qui concatené avec la sous famille, puis il est utilisé pour fetcher la valeur dans le collection FAMILY
    GA_LIBREART4 : string, // c'est une valeur qui lie à collection BRAND, et dans la collection BRAND, YX_CODE lie avec celle-ci.
    GA_FOURNPRINC: string, // lié à la collection "SUPPLIER" sur la clé "t_tiers"
    GA_FERME: string,       // acts as a boolean, either "X" or "-" BIG X
    GA_VERSION?: string,
    GA_HISTORIQUE?: ObjectId[]
}

export interface PopulatedProduct extends Product {
    uvc?: Uvc[] | Uvc,
    family?: Family[] | Family,
    subFamily?: Family[] | Family,
    brand?: Brand[] | Brand
}

const productSchema = new mongoose.Schema<Product>({
    GA_CODEARTICLE: {
        type: String,
    },
    GA_LIBCOMPL: {
        type: String
    },
    GA_LIBELLE: {
        type: String
    },
    GA_LIBREART1: { // 21 galibreart1 <-> YXCODE 21 
        type: String,
    },
    GA_LIBREART2: {
        type: String,
    },
    GA_LIBREART4: {
        type: String,
    },
    GA_FOURNPRINC: {
        type: String
    },
    GA_FERME: {
        type: String
    },
    GA_VERSION: {
        type: String
    },
    // GA_HISTORIQUE which will be added 
    GA_HISTORIQUE: [{
        type: Schema.Types.ObjectId
    }]
},  { timestamps: true, collection: "product" })


const ProductModel: Model<Product> = mongoose.model<Product>("product", productSchema);
export default ProductModel;