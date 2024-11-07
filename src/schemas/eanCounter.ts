import mongoose from 'mongoose';

const eanCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    lastCounter: { type: Number, required: true },
});

// Vérifie si le modèle existe déjà avant de le créer
export default mongoose.models.ean_counter || mongoose.model("ean_counter", eanCounterSchema);