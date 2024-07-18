import mongoose ,{ Document, Model, ObjectId} from "mongoose"

export interface Product extends Document {
    creator_id: ObjectId 
    reference: string,
    name: string,
    short_label: string,
    long_label: string,
    type: string,
    tag_ids: ObjectId[],
    princ_supplier_id: ObjectId, // supplier_id c'est le fournisseur principal 
    supplier_ids: ObjectId[] // supplier_ids c'est tout les fournisseurs qui vendent le produit
    dimension_types: string[]
    uvc_ids: ObjectId[],
    brand_ids: ObjectId[],
    collection_ids: ObjectId[], // collection is product collection
    imgPath: string, // collection is product collection
    status: string
    additional_fields: any
}


const productSchema = new mongoose.Schema<Product>({
    creator_id: {type: mongoose.Types.ObjectId},
    reference: {type: String},
    name: {type: String},
    short_label: {type: String},
    long_label: {type: String},
    type: {type: String},
    tag_ids: [{type: mongoose.Types.ObjectId, ref: "tag"}],
    princ_supplier_id: {type: mongoose.Types.ObjectId, ref: "supplier"},
    supplier_ids: [{type: mongoose.Types.ObjectId, ref: "supplier"}],
    dimension_types: [{type: String}],
    uvc_ids: [{type: mongoose.Types.ObjectId, ref: "uvc"}],
    brand_ids: [{type: mongoose.Types.ObjectId, ref: "brand"}],
    collection_ids: [{type: mongoose.Types.ObjectId, ref: "collection"}],
    imgPath: {type: String},
    status: {type: String, default: "A"},
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},  { timestamps: true, collection: "product" })


const ProductModel: Model<Product> = mongoose.model<Product>("product", productSchema);
export default ProductModel;