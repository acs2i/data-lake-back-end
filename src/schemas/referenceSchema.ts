// This is a product
import mongoose, { Model, Schema, Document } from "mongoose"

export interface Reference extends Document {
    k: string,
    v: string,
    family: string[],         // this links to the family collection id
    subFamily: string[],         // this links to the family collection id,
    brand: string,
    productCollection: string,
    status: number,
    imgPath: string,
    colors: string[],
    size: string[],
    priceId:  Schema.Types.ObjectId; // this is tarif, it is suppose to be a unique number that links to the other schema
    frnPrincipal: Schema.Types.ObjectId    // linked to the supplier k field,
    uvcs: Schema.Types.ObjectId[],
    version: number,
    reference: string,
    name: string
}


export const referenceSchema = new mongoose.Schema<Reference>({
    reference: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
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
        type: [String],
        unique: false,
        required: false,
        default: []
    },
    subFamily: {
        type: [String],
        default: []
    },
    brand: {
        type: String,
    },
    productCollection: {
        type: String,
      },
    // colors: {
    //     type: [String],
    //     unique: false,
    //     required: true
    // },
    frnPrincipal: {
        type: Schema.Types.ObjectId,
        unique: false,
        required: false
    },
    uvcs : [{
        type: Schema.Types.ObjectId,
        unique: false,
        required: false,
    }],    // objectid(12345566)
    // size: {
    //     type: [String],
    //     unique: false,
    //     required: true,
    //     validate: {
    //         validator: (value: string[]) => {
    //             value.length > 0 ? true : false
    //         },
    //     }
    // },
    priceId: [
        {
            type: Schema.Types.ObjectId,
            pref: "price",
        }
    ],
    status: {
        type: Number,
        unique: false,
        required: false,
        default: 0
    },
    imgPath: {
        type: String,
        default: ""
    },
    // VERSION WILL START AT 1
    version: {
        type: Number,
        unique: false,
        required: true
    }



},{ collection: "reference", timestamps: true} )

const ReferenceModel: Model<Reference> = mongoose.model("reference", referenceSchema)

export default ReferenceModel