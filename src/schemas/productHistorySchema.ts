import mongoose, { Model, ObjectId, Schema } from "mongoose";
import { Product } from "./productSchema";
/*
Note:
    La raison d'avoir une autre collection pour les histoires de produit plutot que la meme collection
    est que: Si vous cherchez tous les produits par libelle, par exemple, vous ne voudrez que les versions actuelles, et pas les anciennes. 

    Avoir les anciennes versions dans une autre table permet aux serveur de ne pas s'occuper de differencier entre la courante et la ancienne.

*/

export interface ProductHistory extends Product {
    parent_product_id: ObjectId
}


const productHistorySchema = new mongoose.Schema<ProductHistory>({
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
    dimension_ids: [{type: mongoose.Types.ObjectId, ref: "dimension"}],
    version: {type: Number},
    parent_product_id: {type: mongoose.Types.ObjectId}
},  { timestamps: true, collection: "product_history" })

const ProductHistoryModel: Model<ProductHistory> = mongoose.model<ProductHistory>("product_history", productHistorySchema);
export default ProductHistoryModel;