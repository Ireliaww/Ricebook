import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FilterTermContext } from "../../context/FilterTermContext";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/authActions";
import { selectUser } from "../../reducer/authReducer";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const Navbar = () => {
  const currentUser = useSelector(selectUser);

  const [showDropdown, setShowDropdown] = useState(false);

  const { filterTerm, setFilterTerm } = useContext(FilterTermContext);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchIconClick = () => {
    if (!searchTerm) {
      setFilterTerm("");
    } else {
      setFilterTerm(searchTerm);
    }
  };

  const handleLogout = () => {
    // Your logout logic here

    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <Link className="navbar-brand" to="/">
            Ricebook
          </Link>
        </div>

        <div className="d-flex mx-auto">
          <form className="form-inline">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleInputChange}
            />
            <SearchOutlinedIcon
              onClick={handleSearchIconClick}
              style={{ cursor: "pointer", color: "#938eef" }}
            />
          </form>
        </div>

        <div className="d-flex align-items-center">
          <Dropdown
            className="ms-3 profile-dropdown"
            show={showDropdown}
            onToggle={(isOpen) => setShowDropdown(isOpen)}
          >
            <Dropdown.Toggle
              variant="link"
              id="dropdown-basic"
              className="btn-sm d-flex align-items-center profile-toggle"
            >
              <img
                src={currentUser.avatar}
                alt=""
                className="rounded-cirlce profile-picture"
              />
              <span>{currentUser.username}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="custom-dropdown-menu">
              <Dropdown.Item
                className="d-flex justify-content-center align-items-center"
                onClick={() => navigate(`/profile/${currentUser.id}`)}
              >
                <SettingsOutlinedIcon style={{ marginRight: "5px" }} />
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                className="d-flex justify-content-center align-items-center"
                onClick={() => handleLogout()}
              >
                <LogoutOutlinedIcon style={{ marginRight: "5px" }} />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;