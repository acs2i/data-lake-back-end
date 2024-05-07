import mongoose from "mongoose";

interface Grid {
    LIBELLE: string, 
    TYPE: string,
    DIMENSIONS: string[]
}

const gridSchema = new mongoose.Schema<Grid>({
    LIBELLE: {
        type: String
    }, 
    TYPE: {
        type: String
    },
    DIMENSIONS: {
        type: [String]
    }
}, { timestamps: true, collection: "grid" })

const GridModel = mongoose.model<Grid>("grid", gridSchema)
export default GridModel