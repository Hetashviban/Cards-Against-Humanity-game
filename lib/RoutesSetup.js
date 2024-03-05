import PagesRoutes from "../routes/PagesRoutes.js";
import CardRoutes from "../routes/CardRoutes.js";
import UserRoutes from "../routes/UserRoutes.js";
import AuthenticationRoutes from "../routes/AuthenticationRoutes.js"
import ApplicationRoutes from  '../routes/ApplicationRoutes.js'

export default (app) => {
    app.use("/", PagesRoutes); //This tells Express to use the routes defined in pageRoutes for requests with URLs starting with /
    
    // Our Card routes
    app.use("/cards", CardRoutes);

    app.use("/", AuthenticationRoutes);
    app.use("/applications", ApplicationRoutes);

    // Our User routes
    app.use("/users", UserRoutes);
};