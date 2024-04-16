import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    creatorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
  },
  { timestamps: true, collection: "collection" }
);

const CollectionModel = mongoose.model("collection", CollectionSchema);
export default CollectionModel;
