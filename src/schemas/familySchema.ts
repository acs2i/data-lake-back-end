import mongoose, { Model, ObjectId } from "mongoose"

interface SubFamily {
    default: ObjectId,
}

interface Family {
    k: string,
    type: string,
    parents: string[],
    key: string,
    name: string,
    subFamily: 
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
    // avc front end vince
    name: {
        type: String,
        required: true,
      },
    subFamily: [
        { type: mongoose.Types.ObjectId, default: [], ref: "subFamily" },
    ],


}, { collection: "family", timestamps: true} )


const FamilyModel: Model<Family> = mongoose.model("family", familySchema)

export default FamilyModel;
