
import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true
        },
        endpointId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Endpoint",
            required: true
        },
        url: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending"
        },
        statusCode: {
            type: Number,
            default: null
        },
        responseBody: {
            type: String,
            default: ""
        },
        error: {
            type: String,
            default: ""
        },
        attempts: {
            type: Number,
            default: 0
        },
        deliveredAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.models.Delivery ||
    mongoose.model("Delivery", deliverySchema);
