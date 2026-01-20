import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Share from "./Share";

const mockStore = configureStore([]);

describe("Share Component", () => {
  let store;

  const defaultUser = {
    id: 1,
    username: "testuser",
    avatar: "https://example.com/avatar.jpg",
  };

  beforeEach(() => {
    store = mockStore({
      auth: {
        currentUser: defaultUser,
        isLoggedIn: true,
      },
      posts: {
        posts: [],
      },
    });
    store.dispatch = jest.fn();
  });

  const renderShare = () => {
    return render(
      <Provider store={store}>
        <Share />
      </Provider>
    );
  };

  it("should render the share component with user avatar", () => {
    renderShare();
    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("src", defaultUser.avatar);
  });

  it("should render the text input with placeholder", () => {
    renderShare();
    expect(
      screen.getByPlaceholderText(`What's on your mind, ${defaultUser.username}?`)
    ).toBeInTheDocument();
  });

  it("should update input value when typing", () => {
    renderShare();
    const input = screen.getByPlaceholderText(
      `What's on your mind, ${defaultUser.username}?`
    );

    fireEvent.change(input, { target: { value: "Test post content" } });

    expect(input.value).toBe("Test post content");
  });

  it("should render Post and Cancel buttons", () => {
    renderShare();
    expect(screen.getByText("Post")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("should render Add Image label", () => {
    renderShare();
    expect(screen.getByText("Add Image")).toBeInTheDocument();
  });

  it("should show error when posting empty content", () => {
    renderShare();

    const postButton = screen.getByText("Post");
    fireEvent.click(postButton);

    expect(
      screen.getByText("Please enter some text or upload an image.")
    ).toBeInTheDocument();
  });

  it("should clear input when Cancel button is clicked", () => {
    renderShare();
    const input = screen.getByPlaceholderText(
      `What's on your mind, ${defaultUser.username}?`
    );

    fireEvent.change(input, { target: { value: "Test post content" } });
    expect(input.value).toBe("Test post content");

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(input.value).toBe("");
  });

  it("should clear error when Cancel button is clicked after error", () => {
    renderShare();

    // First trigger the error
    const postButton = screen.getByText("Post");
    fireEvent.click(postButton);

    expect(
      screen.getByText("Please enter some text or upload an image.")
    ).toBeInTheDocument();

    // Then click cancel
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(
      screen.queryByText("Please enter some text or upload an image.")
    ).not.toBeInTheDocument();
  });

  it("should have a hidden file input for image upload", () => {
    renderShare();
    const fileInput = document.getElementById("file");
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveStyle({ display: "none" });
  });

  it("should validate file type on image upload", () => {
    renderShare();

    const fileInput = document.getElementById("file");
    const invalidFile = new File(["test"], "test.txt", { type: "text/plain" });

    Object.defineProperty(fileInput, "files", {
      value: [invalidFile],
    });

    fireEvent.change(fileInput);

    expect(
      screen.getByText("Invalid file type. Only JPEG and PNG are allowed.")
    ).toBeInTheDocument();
  });

  it("should show file size error for large files", () => {
    renderShare();

    const fileInput = document.getElementById("file");
    // Create a file larger than 5MB
    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });
    Object.defineProperty(largeFile, "size", { value: 6 * 1024 * 1024 });

    Object.defineProperty(fileInput, "files", {
      value: [largeFile],
    });

    fireEvent.change(fileInput);

    expect(screen.getByText("File size exceeds 5 MB.")).toBeInTheDocument();
  });
});
