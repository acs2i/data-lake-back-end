import mongoose, { Document, Model } from "mongoose";


interface Client extends Document {
    type: string,
    ser_field: string[]
}

const clientSchema = new mongoose.Schema<Client>({
    type: {type: String},
    ser_field: [{type: String}]
}, {timestamps: true, collection: "client"})

const ClientModel: Model<Client> = mongoose.model<Client>("client", clientSchema)

export default ClientModel