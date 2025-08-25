// app.test.js
const request = require("supertest");
const app = require("../../src/app");

describe("GET /up", () => {
  it("should return a json response with a default message.", async () => {
    const res = await request(app)
      .get("/up")
      .expect(200);

    expect(res.body.message).toBe("Todo REST API by Express & PostgreSQL");
  });
});
