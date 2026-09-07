import { useState } from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaSearch,
  FaUser,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import "./Navbar.css";

const Navbar = () => {
  const { cartCount } = useCart();
  const { currentUser, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* BRAND */}
        <Link to="/" className="brand" onClick={closeMenu}>
          RIJALS
          <span>INVESTMENT</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/catalog">Shop</NavLink>
          <NavLink to="/catalog?category=Caps">Caps</NavLink>
          <NavLink to="/catalog?category=Perfumes">Perfumes</NavLink>
          <NavLink to="/catalog?category=Jallabiya">Jallabiya</NavLink>
          <NavLink to="/catalog?category=Wristwatches">Watches</NavLink>
        </nav>

        {/* SEARCH */}
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button type="submit">
            <FaSearch />
          </button>
        </form>

        {/* CUSTOMER ACCOUNT */}
        <div className="customer-account">
          {isAuthenticated ? (
            <div className="account-menu">
              <Link to="/account" className="account-link">
                <FaUser />

                <span className="account-name">
                  {currentUser?.name?.split(" ")[0] || "Account"}
                </span>
              </Link>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="account-link">
              <FaUser />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* CART */}
        <Link to="/cart" className="cart-link">
          <FaShoppingBag />

          <span className="cart-text">Cart</span>

          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={menuOpen ? "mobile-menu active" : "mobile-menu"}>
        {/* MOBILE SEARCH */}
        <form className="mobile-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/catalog" onClick={closeMenu}>
          Shop
        </NavLink>

        <NavLink to="/catalog?category=Caps" onClick={closeMenu}>
          Caps
        </NavLink>

        <NavLink to="/catalog?category=Perfumes" onClick={closeMenu}>
          Perfumes
        </NavLink>

        <NavLink to="/catalog?category=Jallabiya" onClick={closeMenu}>
          Jallabiya
        </NavLink>

        <NavLink to="/catalog?category=Wristwatches" onClick={closeMenu}>
          Wristwatches
        </NavLink>

        {/* MOBILE ACCOUNT */}
        {isAuthenticated ? (
          <>
            <NavLink to="/account" onClick={closeMenu}>
              <FaUser /> My Account
            </NavLink>

            <NavLink to="/orders" onClick={closeMenu}>
              My Orders
            </NavLink>

            <button
              type="button"
              className="mobile-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" onClick={closeMenu}>
            <FaUser /> Login / Register
          </NavLink>
        )}

        {/* MOBILE CART */}
        <NavLink to="/cart" onClick={closeMenu}>
          <FaShoppingBag /> Cart
          {cartCount > 0 && ` (${cartCount})`}
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
