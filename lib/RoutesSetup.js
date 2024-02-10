import PageRoutes from "../routes/PageRoutes.js";
import CardRoutes from "../routes/CardRoutes.js";
import UserRoutes from "../routes/UserRoutes.js";
import AuthenticationRoutes from "../routes/AuthenticationRoutes.js";

export default (app) => {
    app.use("/", PageRoutes); //This tells Express to use the routes defined in pageRoutes for requests with URLs starting with /

    // Authentication routes
    app.use("/", AuthenticationRoutes);
    
    // Our Card routes
    app.use("/cards", CardRoutes);

    // Our User routes
    app.use("/users", UserRoutes);
};