
import mongoose, { Model, Schema } from "mongoose"
import { UVC } from "../interfaces/resultInterfaces";



const UVCSchema = new mongoose.Schema<UVC>({
    k: {
        type: String,
        unique: false,
        required: false
    },
    code: {
        type: String,
        unique: false,
        required: false
    },
    color: {
        type: [String],
        unique: false,
        required: false
    },
    size: {
        type: [String],
        unique: false,
        required: false 
    },
    // size: {
    //     type: String,
    //     unique: false,
    //     required: false 
    // },
    eans: {
        type: [String],
        unique: false,
        required: false
    },
    images: {
        type: Schema.Types.Mixed,
        required: false,
        unique: false
    },
    uvcs: {
        type: Schema.Types.Mixed,
        required: false,
        unique: false
    },
    prices: {
        type: [Number],
        required: false,
        unique: false
    }
    // prices: {
    //     type: Schema.Types.Mixed,
    //     required: false,
    //     unique: false
    // }

}, { collection: "uvc", timestamps: true})

const UVCModel: Model<UVC> = mongoose.model("uvc", UVCSchema)

export default UVCModel;
