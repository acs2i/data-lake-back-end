import mongoose, { Document } from "mongoose";


interface Group extends Document {
    code: string,
    label: string,
    type: string
}


const groupSchema = new mongoose.Schema<Group>({
    code: {type: String},
    label: {type: String},
    type: {type: String}
}, {timestamps: true, collection: "group"})

const GroupModel = mongoose.model<Group>("group", groupSchema)
export default GroupModel