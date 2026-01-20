import authReducer, { selectUser, selectProfilePic } from "./authReducer";
import { login, register, logout } from "../actions/authActions";

describe("authReducer", () => {
  const initialState = {
    currentUser: null,
    isLoggedIn: false,
    profilePic: null,
  };

  const mockUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    profilePic: "https://example.com/avatar.jpg",
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("Initial State", () => {
    it("should return the initial state when no action is provided", () => {
      const state = authReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual(initialState);
    });
  });

  describe("Login Action", () => {
    it("should handle login action and set user data", () => {
      const state = authReducer(initialState, login(mockUser));

      expect(state.currentUser).toEqual(mockUser);
      expect(state.isLoggedIn).toBe(true);
      expect(state.profilePic).toBe(mockUser.profilePic);
    });

    it("should update state when logging in as a different user", () => {
      const firstUser = { ...mockUser, id: 1, username: "user1" };
      const secondUser = { ...mockUser, id: 2, username: "user2" };

      let state = authReducer(initialState, login(firstUser));
      expect(state.currentUser.username).toBe("user1");

      state = authReducer(state, login(secondUser));
      expect(state.currentUser.username).toBe("user2");
    });
  });

  describe("Register Action", () => {
    it("should handle register action and set user data", () => {
      const state = authReducer(initialState, register(mockUser));

      expect(state.currentUser).toEqual(mockUser);
      expect(state.isLoggedIn).toBe(true);
      expect(state.profilePic).toBe(mockUser.profilePic);
    });

    it("should set isLoggedIn to true after registration", () => {
      const state = authReducer(initialState, register(mockUser));
      expect(state.isLoggedIn).toBe(true);
    });
  });

  describe("Logout Action", () => {
    it("should handle logout action and clear user data", () => {
      // First login
      let state = authReducer(initialState, login(mockUser));
      expect(state.isLoggedIn).toBe(true);

      // Then logout
      state = authReducer(state, logout());

      expect(state.currentUser).toBeNull();
      expect(state.isLoggedIn).toBe(false);
      expect(state.profilePic).toBeNull();
    });

    it("should clear localStorage on logout", () => {
      localStorage.setItem("persist:root", "test");
      localStorage.setItem("user", "test");

      authReducer(initialState, logout());

      expect(localStorage.getItem("persist:root")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("Selectors", () => {
    it("selectUser should return the current user", () => {
      const state = { auth: { currentUser: mockUser, isLoggedIn: true } };
      expect(selectUser(state)).toEqual(mockUser);
    });

    it("selectUser should return null when not logged in", () => {
      const state = { auth: initialState };
      expect(selectUser(state)).toBeNull();
    });

    it("selectProfilePic should return the profile picture", () => {
      const state = {
        auth: { currentUser: mockUser, profilePic: mockUser.profilePic },
      };
      expect(selectProfilePic(state)).toBe(mockUser.profilePic);
    });

    it("selectProfilePic should return null when not logged in", () => {
      const state = { auth: initialState };
      expect(selectProfilePic(state)).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("should handle user with missing profilePic", () => {
      const userWithoutPic = { id: 1, username: "testuser" };
      const state = authReducer(initialState, login(userWithoutPic));

      expect(state.currentUser).toEqual(userWithoutPic);
      expect(state.profilePic).toBeUndefined();
    });

    it("should handle unknown action types gracefully", () => {
      const state = authReducer(initialState, { type: "UNKNOWN_ACTION" });
      expect(state).toEqual(initialState);
    });
  });
});
