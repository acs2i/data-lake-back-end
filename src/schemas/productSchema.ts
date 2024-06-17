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
    // family_ids: ObjectId[]
    dimension_type_id: ObjectId      // shouldnt this be id?
    dimension_ids: ObjectId[]
    tag_ids: ObjectId[]
    tag_grouping_ids: ObjectId[]
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
    supplier_id: {type: mongoose.Types.ObjectId, ref: "supplier"},
    // family_ids: [{type: mongoose.Types.ObjectId}],
    tag_ids: [{type: mongoose.Types.ObjectId, ref: "tag"}],
    tag_grouping_ids: [{type: mongoose.Types.ObjectId, ref: "tag_grouping"}],
    brand_id: {type: mongoose.Types.ObjectId, ref: "brand"},
    collection_id: {type: mongoose.Types.ObjectId, ref: "collection"},
    reference: {type: String},  
    long_name: {type: String},
    short_name: {type: String},
    dimension_type_id: {type: mongoose.Types.ObjectId, ref: "dimension_type"},
    dimension_ids: [{type: mongoose.Types.ObjectId, ref: "dimension"}]
},  { timestamps: true, collection: "product" })


const ProductModel: Model<Product> = mongoose.model<Product>("product", productSchema);
export default ProductModel;