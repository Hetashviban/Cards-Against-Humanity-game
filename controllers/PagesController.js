//We have learnt to export we use
//export { home }; -- This is not a common convention

//Best practice would be to use arrow functions wherever you can
export const home = (_, response,) => {
    //We are not using request - instead of removing it all together,we are replacing it with underscore
    response.render("pages/home", {
        title: "Home"
    });
};
