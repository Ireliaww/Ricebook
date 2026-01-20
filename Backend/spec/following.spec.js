const request = require("supertest");
const app = require("../index");
const User = require("../src/model/UserSchema");
const Profile = require("../src/model/ProfileSchema");

require("dotenv").config();
process.env.NODE_ENV = "test";

describe("Following API Tests", () => {
  let agent;
  let server;
  const testUser1 = {
    username: "followTestUser1",
    password: "testpass123",
    email: "follow1@example.com",
    dob: "1990-01-01",
    phone: "1111111111",
    zipcode: "11111",
  };

  const testUser2 = {
    username: "followTestUser2",
    password: "testpass456",
    email: "follow2@example.com",
    dob: "1992-02-02",
    phone: "2222222222",
    zipcode: "22222",
  };

  const testUser3 = {
    username: "followTestUser3",
    password: "testpass789",
    email: "follow3@example.com",
    dob: "1994-03-03",
    phone: "3333333333",
    zipcode: "33333",
  };

  beforeAll(async () => {
    server = app.listen(0);
    const { port } = server.address();
    agent = request.agent(`http://localhost:${port}`);
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Profile.deleteMany({});

    // Register all test users
    await request(app).post("/register").send(testUser1).expect(200);
    await request(app).post("/register").send(testUser2).expect(200);
    await request(app).post("/register").send(testUser3).expect(200);

    // Login as testUser1
    await agent
      .post("/login")
      .send({ username: testUser1.username, password: testUser1.password })
      .expect(200);
  });

  describe("GET /following", () => {
    it("should get the current user following list (initially empty)", async () => {
      const response = await agent.get("/following").expect(200);
      expect(response.body.username).toBe(testUser1.username);
      expect(response.body.following).toEqual([]);
    });

    it("should get another user's following list", async () => {
      const response = await agent
        .get(`/following/${testUser2.username}`)
        .expect(200);
      expect(response.body.username).toBe(testUser2.username);
      expect(response.body.following).toBeDefined();
    });
  });

  describe("PUT /following/:user", () => {
    it("should add a user to following list", async () => {
      const response = await agent
        .put(`/following/${testUser2.username}`)
        .expect(200);

      expect(response.body.username).toBe(testUser1.username);
      expect(response.body.following).toContain(testUser2.username);
    });

    it("should add multiple users to following list", async () => {
      await agent.put(`/following/${testUser2.username}`).expect(200);

      const response = await agent
        .put(`/following/${testUser3.username}`)
        .expect(200);

      expect(response.body.following).toContain(testUser2.username);
      expect(response.body.following).toContain(testUser3.username);
    });

    it("should return error when trying to follow non-existent user", async () => {
      const response = await agent
        .put("/following/nonexistentuser")
        .expect(404);

      expect(response.body.error).toBe("User to follow not found");
    });
  });

  describe("DELETE /following/:user", () => {
    it("should remove a user from following list", async () => {
      // First follow the user
      await agent.put(`/following/${testUser2.username}`).expect(200);

      // Then unfollow
      const response = await agent
        .delete(`/following/${testUser2.username}`)
        .expect(200);

      expect(response.body.username).toBe(testUser1.username);
      expect(response.body.following).not.toContain(testUser2.username);
    });

    it("should return error when trying to unfollow non-existent user", async () => {
      const response = await agent
        .delete("/following/nonexistentuser")
        .expect(404);

      expect(response.body.error).toBe("User to unfollow not found");
    });

    it("should return error when trying to unfollow a user not being followed", async () => {
      const response = await agent
        .delete(`/following/${testUser2.username}`)
        .expect(400);

      expect(response.body.error).toBe("You are not following this user");
    });
  });

  describe("Following workflow", () => {
    it("should handle complete follow/unfollow workflow", async () => {
      // Initial state: no followers
      let response = await agent.get("/following").expect(200);
      expect(response.body.following).toHaveLength(0);

      // Follow user2
      response = await agent.put(`/following/${testUser2.username}`).expect(200);
      expect(response.body.following).toHaveLength(1);

      // Follow user3
      response = await agent.put(`/following/${testUser3.username}`).expect(200);
      expect(response.body.following).toHaveLength(2);

      // Unfollow user2
      response = await agent.delete(`/following/${testUser2.username}`).expect(200);
      expect(response.body.following).toHaveLength(1);

      // Verify final state
      response = await agent.get("/following").expect(200);
      expect(response.body.following).not.toContain(testUser2.username);
    });
  });
});
