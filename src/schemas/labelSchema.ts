// id -
// label 
// propre aux clients 
import mongoose, {Document, Model} from "mongoose"


export interface Label extends Document {
    edition: string,     // like the name of the collection of styles, ie calvin klein edition
    label: string,
}


export const labelSchema = new mongoose.Schema<Label>({
    edition: {
        type: String,
        unique: false,
        required: true
    },
    label: {
        type: String,
        unique: false,
        required: true
    }
}, { collection: "label", timestamps: true });

const LabelModel: Model<Label> = mongoose.model("label", labelSchema);

export default LabelModel;

