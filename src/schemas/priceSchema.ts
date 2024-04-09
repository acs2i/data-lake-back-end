import mongoose, { Model, ObjectId } from "mongoose"

export interface Price {
    price: number | undefined
    // _id?: undefined | ObjectId
}



const priceSchema = new mongoose.Schema<Price>({
    price: {
        type: Number,
        unique: false,
        required: true
    }

}, { collection: "price", timestamps: true} )


const PriceModel: Model<Price> = mongoose.model("price", priceSchema)

export default PriceModel;
