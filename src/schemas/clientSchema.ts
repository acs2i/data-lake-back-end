import mongoose, { Document, Model } from "mongoose";


interface Client extends Document {
    type: string,
    additional_fields: any
}

const clientSchema = new mongoose.Schema<Client>({
    type: {type: String},
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
      }
}, {timestamps: true, collection: "client"})

const ClientModel: Model<Client> = mongoose.model<Client>("client", clientSchema)

export default ClientModel