// This is a product
import mongoose, { Model, Schema, Document } from "mongoose"

export interface Reference extends Document {
    k: string,
    v: string,
    family: string,         // this links to the family collection id
    colors: string[],
    size: string[],
    priceId:  Schema.Types.ObjectId; // this is tarif, it is suppose to be a unique number that links to the other schema
    frnPrincipal: Schema.Types.ObjectId    // linked to the supplier k field
    version: number
}


export const referenceSchema = new mongoose.Schema<Reference>({
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
        type: Schema.Types.ObjectId,
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
    priceId: [
        {
            type: Schema.Types.ObjectId,
            pref: "price",
        }
    ],
    version: {
        type: Number,
        unique: false,
        required: true
    }
  


},{ collection: "reference", timestamps: true} )

const ReferenceModel: Model<Reference> = mongoose.model("reference", referenceSchema)

export default ReferenceModel