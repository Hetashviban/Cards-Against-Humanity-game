import express from "express";
import dotenv from 'dotenv';
import RoutesSetup from "./lib/RoutesSetup.js";
import MongooseSetup from "./lib/MongooseSetup.js";
import PassportSetup from "./lib/PassportSetup.js";
import session from "express-session";

dotenv.config();

MongooseSetup()

const app = express();
//We need to assign the environment variable to a normal variable in our application
//process is an object that provides information about, and control over, the current Node.js process.
// process.env - An object containing the user environment
//.PORT is what is helping us get the access the variable PORT from the env file

//const port = process.env.PORT || 8080;
//We have to guard the port - guarding the port means that if by chance we don't have the port number/ the port number is not defined to run our application, then it can use the port that is 8080 in this case that we have declared.

//Middlewares will always be executed in an order
//GET - clicks a link, url is typed and visited
//POST - form is submitted

// Setup sessions
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: (process.env.NODE_ENV === "production"),
        sameSite: (process.env.NODE_ENV === "production" ? "strict" : "lax")
    }
}));

PassportSetup(app); //This function sets up passport with all its strategies (local signup & login)

//Setting up ejs
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());//parameters and body parameters are turn into JSON objects making it easier to use
app.use(express.urlencoded({ extended: true })); //encoding the data so we can read it on server side

app.use((req, _, next) => {
    if (req.body && typeof req.body === 'object' && "_method" in req.body) {
        const method = req.body._method;
        delete req.body._method;
        req.method = method;
    }
    next();
});

RoutesSetup();

//There can only be one middleware in your application can look like this
app.use((error, _, response, __) => {
    if (typeof error === "string") {
        error = new Error(error); //creating a new error object
    }

    if (!error.status) error.status = 404; //if there's no status property we set it to 404 by default

    console.error(error);

    //We don't want our end user to see the stack trace if there is an error because it is security concern/vulnerability
    //Hence we will send just the error message
    response.status(error.status).send(error.message);
});

//app.use((error, req, res, next) => {});
//Here as we are not using the parameters req and next we will replace it with _ and __ for the following argument

/**
 * We are exporting our application so we are able to use it in
 * our tests
 */
export default app;