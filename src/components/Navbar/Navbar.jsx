import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const [userData, setUserData] = useState(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  // GET USERDATA FROM LOCALSTORAGE
  useEffect(() => {

    const user = localStorage.getItem("userdata");

    console.log("Stored User:", user);

    if (user) {

      setUserData(JSON.parse(user));

    } else {

      setUserData(null);

    }

  }, []);

  // SCROLL EFFECT
  useEffect(() => {

    const handleScroll = () => {

      setIsScrolled(window.scrollY > 50);

    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  // MOBILE MENU
  const toggleMobileMenu = () => {

    setIsMobileMenuOpen(!isMobileMenuOpen);

  };

  // NAVIGATION
  const handleNavigation = (path) => {

    navigate(path);

    setIsMobileMenuOpen(false);

  };

  // LOGOUT
  const handleLogout = () => {

    localStorage.clear();

    setUserData(null);

    navigate("/login");

  };

  return (

    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>

      {/* LOGO */}
      <div className="nav-logo">

        <h2 onClick={() => handleNavigation("/home")}>

          CAR4SALE

        </h2>

      </div>

      {/* MOBILE TOGGLE */}
      <button
        className={`mobile-menu-toggle ${
          isMobileMenuOpen ? "active" : ""
        }`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >

        <span></span>
        <span></span>
        <span></span>

      </button>

      {/* NAV LINKS */}
      <div
        className={`nav-links ${
          isMobileMenuOpen ? "mobile-open" : ""
        }`}
      >

        <Link to="/home">

          <button
            onClick={() => setIsMobileMenuOpen(false)}
          >

            Home

          </button>

        </Link>

        <Link to="/products">

          <button
            onClick={() => setIsMobileMenuOpen(false)}
          >

            Cars

          </button>

        </Link>

        {userData && (

          <Link to="/myorders">

            <button
              onClick={() => setIsMobileMenuOpen(false)}
            >

              Orders

            </button>

          </Link>

        )}

        <Link to="/cart">

          <button
            onClick={() => setIsMobileMenuOpen(false)}
          >

            Cart

          </button>

        </Link>

        {userData && (

          <Link to="/profile">

            <button
              onClick={() => setIsMobileMenuOpen(false)}
            >

              Profile

            </button>

          </Link>

        )}

        {!userData ? (

          <>

            <Link to="/login">

              <button
                onClick={() => setIsMobileMenuOpen(false)}
              >

                Login

              </button>

            </Link>

            <Link to="/register">

              <button
                onClick={() => setIsMobileMenuOpen(false)}
              >

                Register

              </button>

            </Link>

          </>

        ) : null}

        <button
          onClick={() => handleNavigation("/settings")}
        >

          Settings

        </button>

        {userData && (

          <button onClick={handleLogout}>

            Logout

          </button>

        )}

      </div>

      {/* USER NAME */}
      {userData?.name && (

        <p className="namehere">

          Hi, {userData.name.split(" ")[0]}!

        </p>

      )}

    </nav>

  );

}

export default Navbar;