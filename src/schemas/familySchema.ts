import mongoose ,{ Document, Model} from "mongoose"

interface Family extends Document {
    YX_CODE: number,
    YX_TYPE: string,
    YX_LIBELLE: string
}


const familySchema = new mongoose.Schema<Family>({

    YX_CODE: {
        type: Number
    },
    YX_TYPE: { 
        type: String
    },
    YX_LIBELLE: {
        type: String
    }
},  { timestamps: true, collection: "family" })

const FamilyModel: Model<Family> = mongoose.model<Family>("family", familySchema);
export default FamilyModel