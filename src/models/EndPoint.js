import mongoose from "mongoose";

const endpointSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        url: {
            type: String,
            required: true,
            trim: true
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.Endpoint ||
    mongoose.model("Endpoint", endpointSchema);
