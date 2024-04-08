import mongoose, { Model } from "mongoose"

interface Price {
    price: number
}

const priceSchema = new mongoose.Schema<Price>({
    price: {
        type: Number,
        unique: false,
        required: true
    }

})


const PriceModel: Model<Price> = mongoose.model("price", priceSchema)

export default PriceModel;
