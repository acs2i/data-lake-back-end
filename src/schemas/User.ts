import mongoose, { Model } from "mongoose";

export interface User  {
    email: string,
    hashedPassword: string
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true      // means field must have this value when creating/udpating document
    },
    hashedPassword: {
        type: String,
        unique: false,
        required: true
    }

})

// nom de la collection, schema
const UserModel: Model<User> = mongoose.model("users", userSchema);

export default UserModel