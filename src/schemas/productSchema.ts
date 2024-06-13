import mongoose ,{ Document, Model, Schema,ObjectId} from "mongoose"
import { Uvc } from "./uvcSchema";
import { Family } from "./familySchema";
import { Brand } from "./brandSchema";

export interface Product extends Document {
    creator_id: ObjectId,
    reference: string,
    long_name: string,
    short_name: string,
    supplier_id: ObjectId
    family_ids: ObjectId[]
    dimension_type: string      // shouldnt this be id?
    dimension: string[]
    class_ids: ObjectId[]
    classification_ids: ObjectId[]
    brand_id: ObjectId
    collection_id: ObjectId
}

export interface PopulatedProduct extends Product {
    uvcs?: Uvc[] | Uvc,
    family?: Family[] | Family,
    subFamily?: Family[] | Family,
    brand?: Brand[] | Brand
}

const productSchema = new mongoose.Schema<Product>({
    creator_id: {type: mongoose.Types.ObjectId},
    supplier_id: {type: mongoose.Types.ObjectId},
    family_ids: [{type: mongoose.Types.ObjectId}],
    class_ids: [{type: mongoose.Types.ObjectId}],
    classification_ids: [{type: mongoose.Types.ObjectId}],
    brand_id: {type: mongoose.Types.ObjectId},
    collection_id: {type: mongoose.Types.ObjectId},
    reference: {type: String},
    long_name: {type: String},
    short_name: {type: String},
    dimension_type: {type: String},
    dimension: [{type: String}]
},  { timestamps: true, collection: "product" })


const ProductModel: Model<Product> = mongoose.model<Product>("product", productSchema);
export default ProductModel;