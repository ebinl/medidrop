import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Stethoscope, Menu, X, Sun, Moon, Pill, LogIn, LogOut, User, LayoutDashboard, Search, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { shareWebsiteOnWhatsApp } from '../services/shareUtils';

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

export default function Navbar({ cartCount, onCartClick, onConsultationClick, onSearchClick, onShareClick, addToast }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const isHome = location.pathname === '/';
  const [overHero, setOverHero] = useState(isHome);

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
    if (!isHome) {
      setOverHero(false);
      return undefined;
    }

    const update = () => {
      const hero = document.querySelector('.hero-section');
      const cutoff = hero ? hero.offsetHeight - 64 : window.innerHeight * 0.85;
      setOverHero(window.scrollY < cutoff);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isHome]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1100) setMenuOpen(false);
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
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    closeMenu();
    try {
      await logout();
      addToast?.({
        title: 'Signed out',
        message: 'Come back soon.',
        type: 'info',
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      addToast?.({
        title: 'Logout failed',
        message: 'Please try again.',
        type: 'error',
      });
    }
  };

  const handleWhatsAppShare = () => {
    shareWebsiteOnWhatsApp();
    addToast?.({
      title: 'WhatsApp Share',
      message: 'Opening WhatsApp to share MEDI DROP with full details & consultation link.',
      type: 'success',
    });
  };

  const whyUsHref = location.pathname === '/' ? '#features' : '/#features';
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Account';

  const authDesktop = user ? (
    <>
      {isAdmin && (
        <Link to="/admin" className="btn btn-outline nav-auth-btn" onClick={closeMenu}>
          <LayoutDashboard size={15} />
          <span>Admin</span>
        </Link>
      )}
      <span className="nav-user-chip" title={user.email || ''}>
        <User size={14} />
        <span>{displayName}</span>
      </span>
      <button type="button" className="btn btn-outline nav-auth-btn" onClick={handleLogout}>
        <LogOut size={15} />
        <span>Logout</span>
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="nav-link nav-auth-link" onClick={closeMenu}>
        Login
      </Link>
      <Link to="/signup" className="btn btn-outline nav-auth-btn" onClick={closeMenu}>
        <LogIn size={15} />
        <span>Sign Up</span>
      </Link>
    </>
  );

  const authMobile = user ? (
    <>
      {isAdmin && (
        <Link to="/admin" className="btn btn-outline nav-auth-btn nav-auth-mobile" onClick={closeMenu}>
          <LayoutDashboard size={15} />
          <span>Admin</span>
        </Link>
      )}
      <div className="nav-user-chip nav-user-chip-mobile">
        <User size={14} />
        <span>{displayName}</span>
      </div>
      <button type="button" className="btn btn-outline nav-auth-btn nav-auth-mobile" onClick={handleLogout}>
        <LogOut size={15} />
        <span>Logout</span>
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="nav-link" onClick={closeMenu}>
        Login
      </Link>
      <Link to="/signup" className="btn btn-outline nav-auth-btn nav-auth-mobile" onClick={closeMenu}>
        <LogIn size={15} />
        <span>Sign Up</span>
      </Link>
    </>
  );

  const desktopNavItems = (
    <>
      <button
        type="button"
        className="nav-search-trigger-btn"
        onClick={onSearchClick}
        aria-label="Instant search remedies, symptoms & consult"
      >
        <Search size={15} />
        <span>Instant Search...</span>
        <kbd className="nav-search-kbd">⌘K</kbd>
      </button>

      <NavLink to="/remedies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
        Remedies
      </NavLink>
      <a href={whyUsHref} className="nav-link" onClick={closeMenu}>Why Us</a>
      <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
        Contact
      </NavLink>
      <button type="button" onClick={handleConsult} className="btn btn-outline nav-consult-btn">
        <Stethoscope size={16} />
        <span>Consult Doctor</span>
      </button>
      {authDesktop}
    </>
  );

  const mobileNavItems = (
    <>
      <button
        type="button"
        onClick={() => { closeMenu(); onSearchClick(); }}
        className="nav-link nav-mobile-action-row nav-mobile-search-row"
      >
        <span className="nav-mobile-action-label">
          <Search size={17} />
          <span>Instant Search Remedies & Consult</span>
        </span>
        <kbd className="nav-search-kbd">⌘K</kbd>
      </button>

      <NavLink to="/remedies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
        Remedies
      </NavLink>
      <a href={whyUsHref} className="nav-link" onClick={closeMenu}>Why Us</a>
      <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
        Contact
      </NavLink>
      <button type="button" onClick={handleConsult} className="btn btn-outline nav-consult-btn nav-consult-mobile">
        <Stethoscope size={16} />
        <span>Consult Doctor</span>
      </button>
      {authMobile}
      <div className="nav-mobile-divider" />
      <button
        type="button"
        onClick={() => { closeMenu(); handleWhatsAppShare(); }}
        className="nav-link nav-mobile-action-row"
      >
        <span className="nav-mobile-action-label">
          <MessageCircle size={17} style={{ color: '#25d366' }} />
          <span>Share on WhatsApp</span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => { closeMenu(); onCartClick(); }}
        className="nav-link nav-mobile-action-row"
      >
        <span className="nav-mobile-action-label">
          <ShoppingCart size={17} />
          <span>Shopping Cart</span>
        </span>
        {cartCount > 0 && (
          <span className="badge badge-primary">{cartCount}</span>
        )}
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className="nav-link nav-mobile-action-row"
      >
        <span className="nav-mobile-action-label">
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          <span>{theme === 'light' ? 'Dark Mode (DND)' : 'Light Mode (DND)'}</span>
        </span>
      </button>
    </>
  );

  return (
    <>
      <nav className={`site-nav glass ${menuOpen ? 'menu-open' : ''} ${overHero && !menuOpen ? 'site-nav--over-hero' : ''}`}>
        <Link to="/" className="brand-logo-link" onClick={closeMenu} aria-label="MEDI DROP home">
          <img
            src="/medidrop-brand-logo.png"
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
            onClick={onSearchClick}
            className="nav-search-icon-btn"
            aria-label="Instant search remedies and symptoms"
            title="Search (⌘K)"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="nav-whatsapp-btn"
            aria-label="Share website on WhatsApp"
            title="Share website on WhatsApp"
          >
            <MessageCircle size={18} />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="nav-theme-btn"
            aria-label={theme === 'light' ? 'Switch to dark theme (DND)' : 'Switch to light theme (DND)'}
            title={theme === 'light' ? 'Dark mode (DND)' : 'Light mode (DND)'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            type="button"
            onClick={onCartClick}
            className="nav-cart-btn"
            aria-label="Open cart"
            title="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="badge badge-primary nav-cart-badge">{cartCount}</span>
            )}
          </button>

          <button
            type="button"
            className="nav-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
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

