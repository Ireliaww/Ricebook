const request = require("supertest");
const app = require("../index");
const User = require("../src/model/UserSchema");
const Profile = require("../src/model/ProfileSchema");

require("dotenv").config();
process.env.NODE_ENV = "test";

describe("Profile API Tests", () => {
  let agent;
  let server;
  const testUser = {
    username: "profileTestUser",
    password: "testpass123",
    email: "profiletest@example.com",
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

    // Register and login test user
    await agent.post("/register").send(testUser).expect(200);
    await agent
      .post("/login")
      .send({ username: testUser.username, password: testUser.password })
      .expect(200);
  });

  describe("Headline Endpoints", () => {
    it("should get the current user headline", async () => {
      const response = await agent.get("/headline").expect(200);
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.headline).toBeDefined();
    });

    it("should update the user headline", async () => {
      const newHeadline = "This is my new headline!";
      const response = await agent
        .put("/headline")
        .send({ headline: newHeadline })
        .expect(200);

      expect(response.body.headline).toBe(newHeadline);

      // Verify the update persisted
      const getResponse = await agent.get("/headline").expect(200);
      expect(getResponse.body.headline).toBe(newHeadline);
    });

    it("should return error when headline is not provided", async () => {
      const response = await agent.put("/headline").send({}).expect(400);
      expect(response.body.error).toBe("Headline is required");
    });
  });

  describe("Email Endpoints", () => {
    it("should get the current user email", async () => {
      const response = await agent.get("/email").expect(200);
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.email).toBe(testUser.email);
    });

    it("should update the user email", async () => {
      const newEmail = "newemail@example.com";
      const response = await agent
        .put("/email")
        .send({ email: newEmail })
        .expect(200);

      expect(response.body.email).toBe(newEmail);
    });

    it("should return error when email is not provided", async () => {
      const response = await agent.put("/email").send({}).expect(400);
      expect(response.body.error).toBe("Email is required");
    });
  });

  describe("Zipcode Endpoints", () => {
    it("should get the current user zipcode", async () => {
      const response = await agent.get("/zipcode").expect(200);
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.zipcode).toBe(testUser.zipcode);
    });

    it("should update the user zipcode", async () => {
      const newZipcode = "90210";
      const response = await agent
        .put("/zipcode")
        .send({ zipcode: newZipcode })
        .expect(200);

      expect(response.body.zipcode).toBe(newZipcode);
    });

    it("should return error when zipcode is not provided", async () => {
      const response = await agent.put("/zipcode").send({}).expect(400);
      expect(response.body.error).toBe("Zipcode is required");
    });
  });

  describe("Phone Endpoints", () => {
    it("should get the current user phone", async () => {
      const response = await agent.get("/phone").expect(200);
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.phone).toBe(testUser.phone);
    });

    it("should update the user phone", async () => {
      const newPhone = "9998887777";
      const response = await agent
        .put("/phone")
        .send({ phone: newPhone })
        .expect(200);

      expect(response.body.phone).toBe(newPhone);
    });

    it("should return error when phone is not provided", async () => {
      const response = await agent.put("/phone").send({}).expect(400);
      expect(response.body.error).toBe("New phone number is required");
    });
  });

  describe("Date of Birth Endpoint", () => {
    it("should get the current user date of birth", async () => {
      const response = await agent.get("/dob").expect(200);
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.dob).toBeDefined();
    });
  });

  describe("Password Endpoint", () => {
    it("should change the user password", async () => {
      const newPassword = "newSecurePassword123";
      const response = await agent
        .put("/password")
        .send({ password: newPassword })
        .expect(200);

      expect(response.body.result).toBe("Password updated successfully");

      // Verify can login with new password
      await agent.put("/logout").expect(200);
      const loginResponse = await agent
        .post("/login")
        .send({ username: testUser.username, password: newPassword })
        .expect(200);

      expect(loginResponse.body.result).toBe("success");
    });

    it("should return error when password is not provided", async () => {
      const response = await agent.put("/password").send({}).expect(400);
      expect(response.body.error).toBe("New password is required");
    });
  });

  describe("Avatar Endpoint", () => {
    it("should get the current user avatar", async () => {
      const response = await agent.get("/avatar").expect(200);
      expect(response.body.username).toBe(testUser.username);
    });
  });
});
