import mongoose, { Document, ObjectId } from "mongoose";

export interface Item extends Document {
 supplier_id: ObjectId,
 price: number,
 currency: string   // c'est la devise, // ajoute les tarifs, 
 ean: string        // c'est la code barre
 creator_id: ObjectId
 additional_fields?: any
 uvc_id: ObjectId // links to uvc, this is the rang 

}

const item = new mongoose.Schema<Item>({
    supplier_id: {type: mongoose.Types.ObjectId, ref: "supplier"},
    uvc_id: {type: mongoose.Types.ObjectId, ref: "uvc"},
    creator_id: {type: mongoose.Types.ObjectId},
    ean: {type: String},
    currency: {type: String},
    price: {type: Number},
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
},{ timestamps: true, collection: "item" })

const ItemModel = mongoose.model<Item>("item", item);
export default ItemModel