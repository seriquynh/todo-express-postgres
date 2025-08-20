// app.test.js
const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/services/db.service");
const { extractErrorMessages } = require("../../src/utils/testing.util");

afterAll(async () => {
  // Close the database connection after all tests are done.
  db.end();
});

beforeEach(async () => {
  // TODO: reset the database before each test.
});

describe("POST /api/register", () => {
  it("should return an error if the name field is missing.", async () => {
    const res = await request(app)
      .post("/api/register")
      .expect(422);

    expect(res.body).toHaveProperty("errors");

    expect(extractErrorMessages(res.body.errors, "name")).toEqual([
      "The name field must be required.",
    ]);
  });

  it("should return an error if the name field is empty.", async () => {
    const res = await request(app)
      .post("/api/register", {
        name: '', // empty string
      })
      .expect(422);

    expect(res.body).toHaveProperty("errors");

    expect(extractErrorMessages(res.body.errors, "name")).toEqual([
      "The name field must be required.",
    ]);
  });

  it("should return an error if the email field is missing.", async () => {
    const res = await request(app)
      .post("/api/register")
      .expect(422);

    expect(res.body).toHaveProperty("errors");

    expect(extractErrorMessages(res.body.errors, "email")).toEqual([
      "The email field must be required.",
      "The email field must be a valid email address.",
    ]);
  });

  it("should return an error if the email field is empty.", async () => {
    const res = await request(app)
      .post("/api/register", {
        email: '', // empty string
      })
      .expect(422);

    expect(res.body).toHaveProperty("errors");

    expect(extractErrorMessages(res.body.errors, "email")).toEqual([
      "The email field must be required.",
      "The email field must be a valid email address.",
    ]);
  });

  // TODO: Test if the email already exists in the database.

  it("should return an error if the password field is missing.", async () => {
    const res = await request(app)
      .post("/api/register")
      .expect(422);

    expect(res.body).toHaveProperty("errors");

    expect(extractErrorMessages(res.body.errors, "password")).toEqual([
      "The password field must be required.",
    ]);
  });

  it("should return an error if the password field is empty.", async () => {
    const res = await request(app)
      .post("/api/register", {
        password: '', // empty string
      })
      .expect(422);

    expect(res.body).toHaveProperty("errors");

    expect(extractErrorMessages(res.body.errors, "password")).toEqual([
      "The password field must be required.",
    ]);
  });
});
