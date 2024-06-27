// import mongoose, { Document } from "mongoose";


// interface Group extends Document {
//     code: string,
//     label: string,
//     type: string
//     additional_fields?: any

// }


// const groupSchema = new mongoose.Schema<Group>({
//     code: {type: String},
//     label: {type: String},
//     type: {type: String},
//     additional_fields:{
//         type: Map,
//         of: mongoose.Schema.Types.Mixed
//     }
// }, {timestamps: true, collection: "group"})

// const GroupModel = mongoose.model<Group>("group", groupSchema)
// export default GroupModel