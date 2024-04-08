import mongoose, { Model } from "mongoose"

interface Family {
    k: string,
    type: string,
    parents: string[],
    key: string
}

const familySchema = new mongoose.Schema<Family>({
    k: {
        type: String,
        unique: false,
        required: false
    },
    type: {
        type: String,
        unique: false,
        required: false
    },
    parents: {
        type: [String],
        unique: false,
        required: false
    },
    key: {
        type: String,
        unique: false,
        required: false
    },

})


const FamilyModel: Model<Family> = mongoose.model("family", familySchema)

export default FamilyModel;
