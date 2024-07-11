import mongoose ,{ Document, Model, ObjectId} from "mongoose"

export interface Product extends Document {
    name: string,
    short_label: string,
    long_label: string,
    type: string,
    tag_ids: ObjectId[],
    supplier_id: ObjectId, // supplier_id c'est le fournisseur principal 
    supplier_ids: ObjectId[] // supplier_ids c'est tout les fournisseurs qui vendent le produit
    dimension_types: string[]
    uvc_ids: ObjectId[],
    brand_ids: ObjectId[],
    collection_ids: ObjectId[], // collection is product collection
    status: string
    creator_id: ObjectId 
    additional_fields: any
}


const productSchema = new mongoose.Schema<Product>({
    creator_id: {type: mongoose.Types.ObjectId},
    name: {type: String},
    long_label: {type: String},
    short_label: {type: String},
    supplier_id: {type: mongoose.Types.ObjectId, ref: "supplier"},
    tag_ids: [{type: mongoose.Types.ObjectId, ref: "tag"}],
    brand_ids: [{type: mongoose.Types.ObjectId, ref: "brand"}],
    collection_ids: [{type: mongoose.Types.ObjectId, ref: "collection"}],
    dimension_types: [{type: String}],
    uvc_ids: [{type: mongoose.Types.ObjectId, ref: "uvc"}],
    type: {type: String},
    status: {type: String},
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},  { timestamps: true, collection: "product" })


const ProductModel: Model<Product> = mongoose.model<Product>("product", productSchema);
export default ProductModel;