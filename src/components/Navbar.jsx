import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, Video, Menu, X, Sun, Moon, Pill } from 'lucide-react';

const THEME_KEY = 'medidrop-theme';

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore
  }
  return 'light';
}

export default function Navbar({ cartCount, onCartClick, onConsultationClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleConsult = () => {
    closeMenu();
    onConsultationClick();
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const whyUsHref = location.pathname === '/' ? '#features' : '/#features';

  const desktopNavItems = (
    <>
      <NavLink to="/remedies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
        Remedies
      </NavLink>
      <a href={whyUsHref} className="nav-link" onClick={closeMenu}>Why Us</a>
      <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
        Contact
      </NavLink>
      <button type="button" onClick={handleConsult} className="btn btn-outline nav-consult-btn">
        <Video size={16} />
        <span>Consult Doctor</span>
      </button>
    </>
  );

  const mobileNavItems = (
    <>
      <NavLink to="/remedies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
        Remedies
      </NavLink>
      <a href={whyUsHref} className="nav-link" onClick={closeMenu}>Why Us</a>
      <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
        Contact
      </NavLink>
      <button type="button" onClick={handleConsult} className="btn btn-outline nav-consult-btn nav-consult-mobile">
        <Video size={16} />
        <span>Consult Doctor</span>
      </button>
    </>
  );

  return (
    <>
      <nav className={`site-nav glass ${menuOpen ? 'menu-open' : ''}`}>
        <Link to="/" className="brand-logo-link" onClick={closeMenu} aria-label="MEDI DROP home">
          <img
            src="/medi-drop-logo-full.png"
            alt="medi drop"
            className="brand-logo-img"
          />
        </Link>

        <div className="nav-links nav-links-desktop">
          {desktopNavItems}
        </div>

        <div className="nav-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="nav-theme-btn"
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <Link
            to="/remedies"
            className="nav-remedies-icon-btn"
            aria-label="Remedies"
            onClick={closeMenu}
          >
            <Pill size={18} strokeWidth={2.25} />
            <span>Remedies</span>
          </Link>

          <button
            type="button"
            onClick={handleConsult}
            className="nav-consult-icon-btn"
            aria-label="Video consulting"
          >
            <Video size={18} strokeWidth={2.25} />
            <span>Consult</span>
          </button>

          <button
            type="button"
            onClick={onCartClick}
            className="nav-cart-btn"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="badge badge-primary nav-cart-badge">{cartCount}</span>
            )}
          </button>

          <button
            type="button"
            className="nav-menu-btn"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div
        className={`nav-backdrop ${menuOpen ? 'visible' : ''}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />
      <div
        className={`nav-links nav-links-mobile ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
      >
        {mobileNavItems}
      </div>
    </>
  );
}
