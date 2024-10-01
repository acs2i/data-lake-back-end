import mongoose, { Document, Model, ObjectId } from "mongoose";

// Interface pour PriceItem
interface PriceItemSchema {
  peau: number; // Prix d'achat
  tbeu_pb: number; // Taux de base en unité - prix de base
  tbeu_pmeu: number; // Taux de base en unité - prix modifié
  _id: ObjectId;
}

// Interface pour Price
interface PriceSchema {
  currency: string; // Devise
  price: PriceItemSchema[]; // Détails des prix
  store: string; // Magasin
}

// Interface pour UVC
export interface Uvc extends Document {
  product_id: ObjectId;
  code: string; // Code de l'UVC
  dimensions: string[]; // Dimensions de l'UVC
  eans: string[]; // Liste des codes EAN
  prices: PriceSchema[]; // Détails des prix
  status: string; // Statut
}

// Schéma pour PriceItem
const priceItemSchema = new mongoose.Schema<PriceItemSchema>({
  peau: { type: Number },
  tbeu_pb: { type: Number },
  tbeu_pmeu: { type: Number },
  _id: { type: mongoose.Types.ObjectId }
}, { _id: false });

// Schéma pour Price
const priceSchema = new mongoose.Schema<PriceSchema>({
  currency: { type: String, default: "" },
  price: [priceItemSchema],
  store: { type: String, default: "" }
}, { _id: false });

// Schéma pour UVC
// Ajouter made_in
// Ajouter custom_cat
// Ajouter les mesures et les poids
const uvcSchema = new mongoose.Schema<Uvc>({
  product_id: { type: mongoose.Types.ObjectId, ref: "product" },
  code: { type: String },
  dimensions: [{ type: String }],
  eans: [{ type: String }],
  prices: [priceSchema],
  status: { type: String, default: "A" },
}, { timestamps: true, collection: "uvc" });

const UvcModel: Model<Uvc> = mongoose.model<Uvc>("uvc", uvcSchema);

export default UvcModel;
