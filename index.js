import express from "express";
const app = express();
//We need to assign the environment variable to a normal variable in our application
//process is an object that provides information about, and control over, the current Node.js process.
// process.env - An object containing the user environment
//.PORT is what is helping us get the access the variable PORT from the env file
const port = process.env.PORT || 8080;
//We have to guard the port - guarding the port means that if by chance we don't have the port number/ the port number is not defined to run our application, then it can use the port that is 8080 in this case that we have declared.

//Middlewares will always be executed in an order
//GET - clicks a link, url is typed and visited
//POST - form is submitted
app.get("/", (req, res) => {
    res.send("Hello! How is it going?");
});

app.get("/insult", async (req, res) => {
    const data = await fetch('https://insult.mattbas.org/api/insult');
    const insult = await data.text();

    res.send(insult);
});

app.get("/:id", (req, res, next) => {
    const id = req.params?.id; //Why did we use ? after req.params - If params has a value, move on to the other property otherwise assign false or null 
    //These way we are guarding the code to handle any errors that might happen/occur
    //Here we are guarding just in case it if the id is null

    //Another way to write this is 
    //const { id } = req.params;

    if (isNaN(id)) {
        //Throwing an error
        const error = new Error(`Parameter is required to be a number and ${id} is not a number.`);
        return next(error);
        //next with no argument will pass it to the next argument/middleware
        //next with an argument will trigger an error handler
    }

    res.send(`Your req id is ${id}`);
    //We can also add logic to the template literals like the following example:
    //res.send(`Your req is ${id}, which is ${id > 10 ? "" : "not"} greater than 10`);
});

//There can only be one middleware in your application can look like this
app.use((error, _, res, __) => {
    res.status(422).send(error.message);
    console.error(error);
});

//app.use((error, req, res, next) => {});
//Here as we are not using the parameters req and next we will replace it with _ and __ for the following argument

app.listen(port, () => console.log(`Server running on https://localhost:${port}`));