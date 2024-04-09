import mongoose, { Model } from "mongoose"

interface Application {
    hashedKey: string
}

export const applicationSchema = new mongoose.Schema<Application>({
    hashedKey: {
        type: String,
        unique: false,
        required: false
    }
}, { collection: "application", timestamps: true} )


const ApplicationModel: Model<Application> = mongoose.model("application", applicationSchema)

export default ApplicationModel;
