import mongoose, { Model } from "mongoose"

interface Application {
    hashedKey: string
}

const applicationSchema = new mongoose.Schema({
    hashedKey: {
        type: String,
        unique: true,
        required: true
    }

})


const ApplicationModel: Model<Application> = mongoose.model("applications", applicationSchema)

export default ApplicationModel;
