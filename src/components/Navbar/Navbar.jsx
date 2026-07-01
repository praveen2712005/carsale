import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [userData, setUserData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("userdata");
    setUserData(stored ? JSON.parse(stored) : null);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const go = (path) => { navigate(path); closeAll(); };

  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
    navigate("/login");
  };

  const initials = (name = "") => {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name[0]?.toUpperCase() ?? "";
  };

  const firstName = userData?.name?.split(" ")[0] ?? "";

  return (
    <>
      <nav className={`nb${isScrolled ? " nb--scrolled" : ""}`} role="navigation" aria-label="Main navigation">

        {/* Logo */}
        <button className="nb__logo" onClick={() => go("/home")} aria-label="Go to home">
          <span className="nb__logo-mark" aria-hidden="true">C</span>
          <span className="nb__logo-text">ar4Sale</span>
        </button>

        {/* Desktop links */}
        <ul className="nb__links" role="list">
          <li><Link to="/home"     className="nb__link" onClick={closeAll}>Home</Link></li>
          <li><Link to="/products" className="nb__link" onClick={closeAll}>Cars</Link></li>
          {userData && (
            <li><Link to="/myorders" className="nb__link" onClick={closeAll}>Orders</Link></li>
          )}
          <li>
            <Link to="/cart" className="nb__link nb__link--cart" onClick={closeAll}>
              <CartIcon />
              Cart
            </Link>
          </li>
        </ul>

        {/* Desktop actions */}
        <div className="nb__actions">
          {!userData ? (
            <>
              <Link to="/login"    className="nb__btn nb__btn--ghost">Sign in</Link>
              <Link to="/register" className="nb__btn nb__btn--primary">Get started</Link>
            </>
          ) : (
            <div className="nb__user" ref={dropdownRef}>
              <button
                className={`nb__user-pill${isDropdownOpen ? " nb__user-pill--open" : ""}`}
                onClick={() => setIsDropdownOpen((v) => !v)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span className="nb__avatar" aria-hidden="true">{initials(userData.name)}</span>
                <span className="nb__user-name">{firstName}</span>
                <ChevronIcon />
              </button>

              {isDropdownOpen && (
                <div className="nb__dropdown" role="menu">
                  <div className="nb__dd-header">
                    <span className="nb__dd-name">{userData.name}</span>
                    <span className="nb__dd-email">{userData.email ?? ""}</span>
                  </div>
                  <hr className="nb__dd-divider" />
                  <DropdownItem icon={<ProfileIcon />} onClick={() => go("/profile")}>Profile</DropdownItem>
                  <DropdownItem icon={<SettingsIcon />} onClick={() => go("/settings")}>Settings</DropdownItem>
                  <hr className="nb__dd-divider" />
                  <DropdownItem icon={<LogoutIcon />} onClick={handleLogout} danger>Sign out</DropdownItem>
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button
            className={`nb__hamburger${isMobileMenuOpen ? " nb__hamburger--open" : ""}`}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nb__drawer${isMobileMenuOpen ? " nb__drawer--open" : ""}`} aria-hidden={!isMobileMenuOpen}>
        <nav aria-label="Mobile navigation">
          <ul className="nb__drawer-links" role="list">
            {[
              { to: "/home",     label: "Home" },
              { to: "/products", label: "Cars" },
              ...(userData ? [{ to: "/myorders", label: "Orders" }] : []),
              { to: "/cart",     label: "Cart" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="nb__drawer-link" onClick={closeAll}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nb__drawer-footer">
          {!userData ? (
            <>
              <Link to="/login"    className="nb__btn nb__btn--ghost  nb__btn--full" onClick={closeAll}>Sign in</Link>
              <Link to="/register" className="nb__btn nb__btn--primary nb__btn--full" onClick={closeAll}>Get started</Link>
            </>
          ) : (
            <button className="nb__btn nb__btn--danger nb__btn--full" onClick={handleLogout}>Sign out</button>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="nb__backdrop" onClick={closeAll} aria-hidden="true" />
      )}
    </>
  );
}

/* ---- Small sub-components ---- */

function DropdownItem({ icon, onClick, danger, children }) {
  return (
    <button
      className={`nb__dd-item${danger ? " nb__dd-item--danger" : ""}`}
      role="menuitem"
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}

function CartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="nb__chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default Navbar;
