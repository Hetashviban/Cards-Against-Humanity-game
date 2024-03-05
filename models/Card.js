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

// the timestamps option is a schema option that, when set to true, automatically adds two fields to the schema: createdAt and updatedAt. These fields are automatically managed by Mongoose and are used to track the creation and last update times of documents in a collection.

export default mongoose.model("Card", CardSchema);