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
      .post("/api/register")
      .send({
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
      .post("/api/register")
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

  it("should return an error if the email field already exists.", async () => {
    // Insert a user with email "johndoe@example.com" into database.
    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      ["John Doe", "johndoe@example.com", await hash.hash("Password1@123")]);

    // Call the register endpoint with the email above.
    const res = await request(app)
      .post("/api/register")
      .send({
        email: 'johndoe@example.com',
      }).expect(422);

    expect(res.body).toHaveProperty("errors");

    expect(extractErrorMessages(res.body.errors, "email")).toEqual([
      "The given E-mail address already exists.",
    ]);
  });

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
      .post("/api/register")
      .send({
        password: '', // empty string
      })
      .expect(422);

    expect(res.body).toHaveProperty("errors");

    expect(extractErrorMessages(res.body.errors, "password")).toEqual([
      "The password field must be required.",
    ]);
  });

  it("should return name and email if successfully.", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("name", "John Doe");
    expect(res.body.data).toHaveProperty("email", "johndoe@example.com");
  });
});
