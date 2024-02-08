//import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";

//This describe is globally defined
describe("PagesController", () => { //describe the object
    describe("GET /", () => {
        it("should respond with the home view", async () => {
            const response = await request(app).get("/"); //This will create a mock

            expect(response.statusCode).toBe(200); //Expecting HTTP status code to be 200, which means OK/success
        });
    }); //describe the method
});