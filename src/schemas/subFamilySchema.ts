import mongoose from "mongoose";

const subFamilySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    familyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "family",
      required: true,
      timestamp: true,
    },
  },
  { collection: "subFamily", timestamps: true} 
);

const SubFamily = mongoose.model("subFamily", subFamilySchema);
export default SubFamily;
