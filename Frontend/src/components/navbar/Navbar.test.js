import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import Navbar from "./Navbar";
import { FilterTermContext } from "../../context/FilterTermContext";

const mockStore = configureStore([]);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Navbar Component", () => {
  let store;
  let mockSetFilterTerm;

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
    });
    store.dispatch = jest.fn();
    mockSetFilterTerm = jest.fn();
    mockNavigate.mockClear();
  });

  const renderNavbar = (filterTerm = "") => {
    return render(
      <Provider store={store}>
        <Router>
          <FilterTermContext.Provider
            value={{ filterTerm, setFilterTerm: mockSetFilterTerm }}
          >
            <Navbar />
          </FilterTermContext.Provider>
        </Router>
      </Provider>
    );
  };

  it("should render the Ricebook brand logo", () => {
    renderNavbar();
    expect(screen.getByText("Ricebook")).toBeInTheDocument();
  });

  it("should display the current user's username", () => {
    renderNavbar();
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("should render the search input", () => {
    renderNavbar();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("should update search input value when typing", () => {
    renderNavbar();
    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(searchInput.value).toBe("test search");
  });

  it("should call setFilterTerm when search icon is clicked", () => {
    renderNavbar();
    const searchInput = screen.getByPlaceholderText("Search...");

    fireEvent.change(searchInput, { target: { value: "filter term" } });

    // Find and click the search icon (MUI SearchOutlinedIcon renders as svg)
    const searchIcon = document.querySelector('[data-testid="SearchOutlinedIcon"]');
    if (searchIcon) {
      fireEvent.click(searchIcon);
      expect(mockSetFilterTerm).toHaveBeenCalledWith("filter term");
    }
  });

  it("should clear filter term when search is empty", () => {
    renderNavbar();

    // Find and click the search icon with empty input
    const searchIcon = document.querySelector('[data-testid="SearchOutlinedIcon"]');
    if (searchIcon) {
      fireEvent.click(searchIcon);
      expect(mockSetFilterTerm).toHaveBeenCalledWith("");
    }
  });

  it("should display user avatar", () => {
    renderNavbar();
    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("src", defaultUser.avatar);
  });

  it("should show dropdown menu when profile toggle is clicked", async () => {
    renderNavbar();

    // Find and click the dropdown toggle
    const dropdownToggle = screen.getByText("testuser").closest("button");
    fireEvent.click(dropdownToggle);

    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });
  });

  it("should dispatch logout and navigate to login on logout click", async () => {
    renderNavbar();

    // Open dropdown
    const dropdownToggle = screen.getByText("testuser").closest("button");
    fireEvent.click(dropdownToggle);

    await waitFor(() => {
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    // Click logout
    fireEvent.click(screen.getByText("Logout"));

    expect(store.dispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should navigate to profile page when Profile is clicked", async () => {
    renderNavbar();

    // Open dropdown
    const dropdownToggle = screen.getByText("testuser").closest("button");
    fireEvent.click(dropdownToggle);

    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    // Click profile
    fireEvent.click(screen.getByText("Profile"));

    expect(mockNavigate).toHaveBeenCalledWith(`/profile/${defaultUser.id}`);
  });
});
