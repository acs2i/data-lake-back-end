// This is a product
import mongoose, { Model, Schema, Document } from "mongoose"
interface ReferenceHistory {
    k: string,
    v: string,
    family: string,
    colors: string[],
    size: string[],
    priceId:  Schema.Types.ObjectId; 
    updated: Date
}

export interface Reference extends Document {
    k: string,
    v: string,
    family: string,         // this links to the family collection id
    colors: string[],
    size: string[],
    priceId?:  Schema.Types.ObjectId; // this is tarif, it is suppose to be a unique number that links to the other schema
    history: ReferenceHistory[],
    frnPrincipal: string    // linked to the supplier k field
}


const referenceSchema = new mongoose.Schema<Reference>({
    k: {
        type: String,
        unique: false,
        required: false
    },
    v: {
        type: String,
        unique: false,
        required: false
    },
    family: {
        type: String,
        unique: false,
        required: false
    },
    colors: {
        type: [String],
        unique: false,
        required: true
    },
    frnPrincipal: {
        type: String,
        unique: false,
        required: false
    },
    size: {
        type: [String],
        unique: false,
        required: true,
        validate: {
            validator: (value: string[]) => {
                value.length > 0 ? true : false
            },
        }
    },
    history: {
        type: Schema.Types.Mixed,
        unique: false, 
        required: false
    },
    priceId: [
        {
            type: Schema.Types.ObjectId,
            pref: "price",
        }
    ],
  


},{ collection: "reference", timestamps: true} )

const ReferenceModel: Model<Reference> = mongoose.model("reference", referenceSchema)

export default ReferenceModel