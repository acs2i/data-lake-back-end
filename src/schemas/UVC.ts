
import mongoose, { Model, Schema } from "mongoose"

interface ImageData {
    src: string         // location of image
}

interface PriceData {
    frn: string, // this connects to the k in the supplier collection,
    priceId:  Schema.Types.ObjectId, // this connects to the Object Id in the price collection
    date: Date,
    price: number
}

interface UVCProperty {
    code: string,
    price: number
}

interface UVC {
    k: string,
    color: string,
    size: string,
    eans: string[],
    images: ImageData[],
    uvcs: UVCProperty[],
    price: PriceData
}

const UVCSchema = new mongoose.Schema<UVC>({
    k: {
        type: String,
        unique: false,
        required: false
    },
    color: {
        type: String,
        unique: false,
        required: false
    },
    size: {
        type: String,
        unique: false,
        required: false 
    },
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
    price: {
        type: Schema.Types.Mixed,
        required: false,
        unique: false
    }

})

const UVCModel: Model<UVC> = mongoose.model("uvc", UVCSchema)

export default UVCModel;
