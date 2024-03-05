import dotenv from "dotenv";
import mongoose from "mongoose";

//This loads our .env and adds the variables to the environment
dotenv.config();

export default () => {
    //Connect to MongoDB Atlas using Mongoose
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}.gzib7wp.mongodb.net/?retryWrites=true&w=majority`)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch(error => console.error(error));
};