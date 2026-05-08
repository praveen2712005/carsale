import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [name, setName] = useState({});
  const [login, setLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userdata");
    console.log(user);

    if (user) {
      setName(JSON.parse(user));
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleLogout = () => {
    localStorage.removeItem("userdata");
    setLogin(false);
    setName({});
    handleNavigation("/login");
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <h2 onClick={() => handleNavigation('/home')}>CAR4SALE</h2>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button 
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Nav Links */}
      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/home">
          <button onClick={() => setIsMobileMenuOpen(false)}>Home</button>
        </Link>
        
        <Link to="/products">
          <button onClick={() => setIsMobileMenuOpen(false)}>Cars</button>
        </Link>
        
        {login && (
          <Link to="/myorders">
            <button onClick={() => setIsMobileMenuOpen(false)}>Orders</button>
          </Link>
        )}
        
        <Link to="/cart">
          <button onClick={() => setIsMobileMenuOpen(false)}>Cart</button>
        </Link>
        
        {login && (
          <Link to="/profile">
            <button onClick={() => setIsMobileMenuOpen(false)}>Profile</button>
          </Link>
        )}
        
        {!login ? (
          <>
            <Link to="/login">
              <button onClick={() => setIsMobileMenuOpen(false)}>Login</button>
            </Link>
            <Link to="/register">
              <button onClick={() => setIsMobileMenuOpen(false)}>Register</button>
            </Link>
          </>
        ) : null}

        <button onClick={() => handleNavigation('/settings')}>
          Settings
        </button>

        {login && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {/* User Name Display */}
      {login && name.name && <p className="namehere">Hi, {name.name.split(' ')[0]}!</p>}
    </nav>
  );
}

export default Navbar;