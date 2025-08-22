const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/services/db.service");
const hash = require("../../src/services/hash.service");
const { extractErrorMessages } = require("../../src/utils/testing.util");

afterAll(async () => {
    await db.end();
});

beforeEach(async () => {
    await db.resetDatabase();
});

describe("POST /api/login", () => {
    it("should return an error if the email field is missing.", async () => {
        const res = await request(app)
            .post("/api/login")
            .expect(422);

        expect(res.body).toHaveProperty("errors");

        expect(extractErrorMessages(res.body.errors, "email")).toEqual([
            "The email field must be required.",
            "The email field must be a valid email address.",
        ]);
    });

    it("should return an error if the email field is empty.", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({
                email: '', // empty string
            })
            .expect(422);

        expect(res.body).toHaveProperty("errors");

        expect(extractErrorMessages(res.body.errors, "email")).toEqual([
            "The email field must be required.",
            "The email field must be a valid email address.",
        ]);
    });

    it("should return an error if the email field is invalid.", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({
                email: 'foobar', // invalid
            })
            .expect(422);

        expect(res.body).toHaveProperty("errors");

        expect(extractErrorMessages(res.body.errors, "email")).toEqual([
            "The email field must be a valid email address.",
            "The given E-mail does not exist.",
        ]);
    });

    it("should return an error if the email does not exist.", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({
                email: 'unkown@example.com',
            })
            .expect(422);

        expect(res.body).toHaveProperty("errors");

        expect(extractErrorMessages(res.body.errors, "email")).toEqual([
            "The given E-mail does not exist.",
        ]);
    });

    it("should return an error if the credentials are incorrect.", async () => {
        await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
            ["John Doe", "johndoe@example.com", await hash.hash("Password1@123")]);

        const res = await request(app)
            .post("/api/login")
            .send({
                email: 'johndoe@example.com',
                password: 'wrong-password',
            })
            .expect(401);


        expect(res.body).toHaveProperty("message");

        expect(res.body.message).toEqual("Incorrect credentials.");
    });

    it("should return access token if credentials are correct.", async () => {
        await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
            ["John Doe", "johndoe@example.com", await hash.hash("Password1@123")]);

        const res = await request(app)
            .post("/api/login")
            .send({
                email: 'johndoe@example.com',
                password: 'Password1@123',
            })
            .expect(200);

        expect(res.body).toHaveProperty("data");

        expect(res.body.data).toHaveProperty("access_token");
    });
});
