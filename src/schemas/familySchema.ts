import mongoose, { Model, ObjectId, Schema } from "mongoose"

interface SubFamily {
    default: ObjectId[],
}

export interface Family {
    k: string,
    type: string,
    parents: string[],
    key: string,
    name: string,
    subFamily:  number [] | string[] | ObjectId[]       // not best practice but lets work with it -_-
    creatorId: ObjectId
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
        { type: mongoose.Types.ObjectId, default: [], ref: "subFamily", required: false },
    ],
    creatorId: {
        type: Schema.Types.ObjectId,
        required: true
    }


}, { collection: "family", timestamps: true} )


const FamilyModel: Model<Family> = mongoose.model("family", familySchema)

export default FamilyModel;
