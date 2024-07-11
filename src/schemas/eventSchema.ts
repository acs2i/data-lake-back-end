import mongoose, { Date, Document, Model } from "mongoose";


export interface Event extends Document {
    code: string,
    label: string,
    type: string,
    date_start: Date,
    date_end: Date,
    timestamp: Date,
    additional_fields?: any

}


const eventSchema = new mongoose.Schema<Event>({
    code: {type: String},
    label: {type: String},
    type: {type: String},
    date_start: {type: Date, required: true},
    date_end: {type: Date, required: true},
    timestamp: {type: Date, default: Date.now},
    additional_fields:{
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {timestamps: true, collection: "event"})

const EventModel: Model<Event> = mongoose.model<Event>("event", eventSchema)

export default EventModel