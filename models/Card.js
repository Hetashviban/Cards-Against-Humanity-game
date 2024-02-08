import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    content: {
        type: String, //datatype
        required: [true, "You must provide content for the card."], //this means that this field is required to be filled out when creating a card
        minlength: [3, "Please provide at least 3 characters."],
        maxlength: [300, "Your card content must be shorter than 2048 characters"]
    },
    type: {
        type: String,
        enum: ["QUESTION", "ANSWER"],
        required: [true, "You must choose a card type"]
    },
}, { timestamps: true });

export default mongoose.model("Card", CardSchema);