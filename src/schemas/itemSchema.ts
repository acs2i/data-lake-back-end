import mongoose, { Document, ObjectId } from "mongoose";

export interface Item extends Document {
 supplier_id: ObjectId,
 price: number,
 currency: string   // c'est la devise, // ajoute les tarifs, 
 ean: string        // c'est la code barre
 creator_id: ObjectId
}

const item = new mongoose.Schema<Item>({
    supplier_id: {type: mongoose.Types.ObjectId, ref: "supplier"},
    creator_id: {type: mongoose.Types.ObjectId},
    ean: {type: String},
    currency: {type: String},
    price: {type: Number}
},{ timestamps: true, collection: "item" })

const ItemModel = mongoose.model<Item>("item", item);
export default ItemModel