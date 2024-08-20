import mongoose, { Document, Model } from "mongoose";

export interface User extends Document {
    email: string,
    password: string    // will be hashed
}

const userSchema = new mongoose.Schema<User>({
    email: {type: String},
    password: {type: String},
}, { timestamps: true, collection: "user"})

const UserModel: Model<User> = mongoose.model<User>("user", userSchema)

export default UserModel
