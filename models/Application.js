import mongoose from "mongoose";
import { generateRandomHexKey } from "../routes/UserRoutes.js";

const ApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "You need a name for your application"]
    },
    key: {
        type: String,
        required: true,
        default: (generateRandomHexKey(16)) // generates 16 hexadecimal characters
    },
    secret: {
        type: String,
        required: true,
        default: (generateRandomHexKey(16)) // generates 16 hexadecimal characters
    }
}, { timestamps: true });

export default mongoose.model("Application", ApplicationSchema);