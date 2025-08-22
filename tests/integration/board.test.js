const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/services/db.service");
const hash = require("../../src/services/hash.service");
const { extractErrorMessages } = require("../../src/utils/testing.util");

async function login() {
    await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        ["John Doe", "johndoe@example.com", await hash.hash("Password1@123")]);

    let result = await db.query("SELECT * FROM users WHERE email = $1", ["johndoe@example.com"]);

    const login = await request(app)
        .post("/api/login")
        .send({
            email: 'johndoe@example.com',
            password: 'Password1@123',
        })
        .expect(200);

    return {
        user: {
            id: result.rows[0].id,
            email: result.rows[0].email,
            name: result.rows[0].name,
        },
        token: login.body.data.access_token,
    }
}

async function createBoard(token) {
    const res = await request(app)
        .post("/api/boards")
        .set({
            'Authorization': `Bearer ${token}`,
        })
        .send({
            name: 'Project 111',
        })
        .expect(201);

    return res.body.data
}

afterAll(async () => {
    await db.end();
});

beforeEach(async () => {
    await db.resetDatabase();
});

describe("GET /api/boards", () => {
    it("should return a list of user boards.", async () => {
        const { token } = await login();

        const res = await request(app)
            .get("/api/boards")
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .expect(200);

        expect(res.body).toHaveProperty("data");
    });
});

describe("POST /api/boards", () => {
    it("should return an error if the name field is missing.", async () => {
        const { token } = await login();

        const res = await request(app)
            .post("/api/boards")
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .expect(422);

        expect(res.body).toHaveProperty("errors");

        expect(extractErrorMessages(res.body.errors, "name")).toEqual([
            "The name field must be required.",
        ]);
    });

    it("should return an error if the name field is empty.", async () => {
        const { token } = await login();

        const res = await request(app)
            .post("/api/boards")
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .send({
                name: ''
            })
            .expect(422);

        expect(res.body).toHaveProperty("errors");

        expect(extractErrorMessages(res.body.errors, "name")).toEqual([
            "The name field must be required.",
        ]);
    });

    it("should create a user board successfully.", async () => {
        const { user, token } = await login();

        const res = await request(app)
            .post("/api/boards")
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .send({
                name: 'Project 111',
            })
            .expect(201);

        expect(res.body).toHaveProperty("data");

        expect(res.body.data).toHaveProperty('id')
        expect(res.body.data.name).toEqual('Project 111')
        expect(res.body.data.user_id).toEqual(user.id)
    });
});

describe("GET /api/boards/:board", () => {
    it("should return an error if the resource is not found.", async () => {
        const { token } = await login();

        const res = await request(app)
            .get("/api/boards/111")
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .expect(404);

        expect(res.body).toHaveProperty("message");
    });

    it("should return a user board", async () => {
        const { token } = await login();

        const board = await createBoard(token);

        const res = await request(app)
            .get(`/api/boards/${board.id}`)
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .expect(200);

        expect(res.body).toHaveProperty("data");

        expect(res.body.data.id).toEqual(board.id)
        expect(res.body.data.name).toEqual(board.name)
        expect(res.body.data.user_id).toEqual(board.user_id)
    });
});

describe("PUT /api/boards/:board", () => {
    it("should return an error if the resource is not found.", async () => {
        const { token } = await login();

        const res = await request(app)
            .put("/api/boards/111")
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .expect(404);

        expect(res.body).toHaveProperty("message");
    });

    it("should return an error if the name field is missing.", async () => {
        const { token } = await login();

        const board = await createBoard(token);

        const res = await request(app)
            .put(`/api/boards/${board.id}`)
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .expect(422);

        expect(res.body).toHaveProperty("errors");

        expect(extractErrorMessages(res.body.errors, "name")).toEqual([
            "The name field must be required.",
        ]);
    });

    it("should return an error if the name field is empty.", async () => {
        const { token } = await login();

        const board = await createBoard(token);

        const res = await request(app)
            .put(`/api/boards/${board.id}`)
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .send({
                name: ''
            })
            .expect(422);

        expect(res.body).toHaveProperty("errors");

        expect(extractErrorMessages(res.body.errors, "name")).toEqual([
            "The name field must be required.",
        ]);
    });

    it("should update a user board successfully.", async () => {
        const { user, token } = await login();

        const board = await createBoard(token);

        const res = await request(app)
            .put(`/api/boards/${board.id}`)
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .send({
                name: 'Project (changed)',
            })
            .expect(200);

        expect(res.body).toHaveProperty("data");

        expect(res.body.data.id).toEqual(board.id)
        expect(res.body.data.name).toEqual('Project (changed)')
        expect(res.body.data.user_id).toEqual(user.id)

        const result = await db.query("SELECT * FROM boards WHERE id = $1 LIMIT 1", [board.id]);

        expect(result.rows[0].name).toEqual('Project (changed)');
    });
});

describe("DELETE /api/boards/:board", () => {
    it("should return an error if the resource is not found.", async () => {
        const { token } = await login();

        const res = await request(app)
            .delete("/api/boards/111")
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .expect(404);

        expect(res.body).toHaveProperty("message");
    });

    it("should delete a user board successfully", async () => {
        const { token } = await login();

        const board = await createBoard(token);

        const res = await request(app)
            .delete(`/api/boards/${board.id}`)
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .expect(200);

        const result = await db.query('SELECT * FROM boards WHERE id = $1 LIMIT 1', [board.id])

        expect(result.rowCount).toEqual(0)
    });
});
