const request = require("supertest");
const app = require("../index");
const User = require("../src/model/UserSchema");
const Profile = require("../src/model/ProfileSchema");
const { Article } = require("../src/model/ArticleSchema");

require("dotenv").config();
process.env.NODE_ENV = "test";

describe("Articles API Tests", () => {
  let agent;
  let server;
  const testUser = {
    username: "articlesTestUser",
    password: "testpass123",
    email: "articles@example.com",
    dob: "1995-05-15",
    phone: "5551234567",
    zipcode: "77005",
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
    await Article.deleteMany({});

    // Register and login test user
    await agent.post("/register").send(testUser).expect(200);
    await agent
      .post("/login")
      .send({ username: testUser.username, password: testUser.password })
      .expect(200);
  });

  describe("GET /articles", () => {
    it("should return empty articles array when no articles exist", async () => {
      const response = await agent.get("/articles").expect(200);
      expect(response.body.articles).toBeDefined();
      expect(response.body.articles).toHaveLength(0);
    });

    it("should return all articles for the current user", async () => {
      // Create some articles first
      await agent.post("/article").send({ text: "First article" }).expect(201);
      await agent.post("/article").send({ text: "Second article" }).expect(201);

      const response = await agent.get("/articles").expect(200);
      expect(response.body.articles).toHaveLength(2);
    });
  });

  describe("POST /article", () => {
    it("should create a new article with text only", async () => {
      const response = await agent
        .post("/article")
        .send({ text: "This is a test article" })
        .expect(201);

      expect(response.body.articles).toBeDefined();
      expect(response.body.articles[0].text).toBe("This is a test article");
      expect(response.body.articles[0].author).toBe(testUser.username);
    });

    it("should create article with unique customId", async () => {
      const response1 = await agent
        .post("/article")
        .send({ text: "First article" })
        .expect(201);

      const response2 = await agent
        .post("/article")
        .send({ text: "Second article" })
        .expect(201);

      expect(response1.body.articles[0].customId).not.toBe(
        response2.body.articles[0].customId
      );
    });

    it("should set the correct date for new article", async () => {
      const beforeTime = new Date();
      const response = await agent
        .post("/article")
        .send({ text: "Test article" })
        .expect(201);
      const afterTime = new Date();

      const articleDate = new Date(response.body.articles[0].date);
      expect(articleDate.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(articleDate.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it("should initialize article with empty comments array", async () => {
      const response = await agent
        .post("/article")
        .send({ text: "Test article" })
        .expect(201);

      expect(response.body.articles[0].comments).toBeDefined();
      expect(response.body.articles[0].comments).toHaveLength(0);
    });
  });

  describe("GET /articles/:id", () => {
    it("should get a specific article by customId", async () => {
      const createResponse = await agent
        .post("/article")
        .send({ text: "Specific article" })
        .expect(201);

      const articleId = createResponse.body.articles[0].customId;

      const response = await agent.get(`/articles/${articleId}`).expect(200);
      expect(response.body.articles[0].text).toBe("Specific article");
    });

    it("should get articles by username", async () => {
      await agent.post("/article").send({ text: "User article" }).expect(201);

      const response = await agent
        .get(`/articles/${testUser.username}`)
        .expect(200);
      expect(response.body.articles.length).toBeGreaterThan(0);
      expect(response.body.articles[0].author).toBe(testUser.username);
    });
  });

  describe("PUT /articles/:id", () => {
    it("should update an existing article text", async () => {
      const createResponse = await agent
        .post("/article")
        .send({ text: "Original text" })
        .expect(201);

      const articleId = createResponse.body.articles[0].customId;

      const updateResponse = await agent
        .put(`/articles/${articleId}`)
        .send({ text: "Updated text" })
        .expect(200);

      expect(updateResponse.body.articles[0].text).toBe("Updated text");
    });

    it("should add a comment to an article", async () => {
      const createResponse = await agent
        .post("/article")
        .send({ text: "Article with comment" })
        .expect(201);

      const articleId = createResponse.body.articles[0].customId;

      const commentResponse = await agent
        .put(`/articles/${articleId}`)
        .send({ commentId: -1, body: "This is a comment" })
        .expect(200);

      expect(commentResponse.body.articles[0].comments).toHaveLength(1);
      expect(commentResponse.body.articles[0].comments[0].body).toBe(
        "This is a comment"
      );
    });

    it("should edit an existing comment", async () => {
      const createResponse = await agent
        .post("/article")
        .send({ text: "Article for comment edit" })
        .expect(201);

      const articleId = createResponse.body.articles[0].customId;

      // Add a comment first
      const addCommentResponse = await agent
        .put(`/articles/${articleId}`)
        .send({ commentId: -1, body: "Original comment" })
        .expect(200);

      const commentId =
        addCommentResponse.body.articles[0].comments[0].customId;

      // Edit the comment
      const editResponse = await agent
        .put(`/articles/${articleId}`)
        .send({ commentId: commentId, body: "Edited comment" })
        .expect(200);

      expect(editResponse.body.articles[0].comments[0].body).toBe(
        "Edited comment"
      );
    });
  });

  describe("Article Authorization", () => {
    it("should require authentication to access articles", async () => {
      // Logout first
      await agent.put("/logout").expect(200);

      // Try to access articles without auth
      const response = await agent.get("/articles").expect(401);
      expect(response.body.error).toBeDefined();
    });

    it("should require authentication to create article", async () => {
      await agent.put("/logout").expect(200);

      const response = await agent
        .post("/article")
        .send({ text: "Unauthorized article" })
        .expect(401);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("Multiple Articles Workflow", () => {
    it("should handle multiple articles creation and retrieval", async () => {
      // Create multiple articles
      for (let i = 1; i <= 5; i++) {
        await agent.post("/article").send({ text: `Article ${i}` }).expect(201);
      }

      // Get all articles
      const response = await agent.get("/articles").expect(200);
      expect(response.body.articles).toHaveLength(5);

      // Verify ordering (most recent first or as configured)
      const texts = response.body.articles.map((a) => a.text);
      expect(texts).toContain("Article 1");
      expect(texts).toContain("Article 5");
    });
  });
});
