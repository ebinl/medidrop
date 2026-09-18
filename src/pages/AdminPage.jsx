import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  MessageSquare,
  Pill,
  LogOut,
  Plus,
  Mail,
  Phone,
  Clock,
  Loader2,
  ShieldCheck,
  Calendar,
  Pencil,
  X,
  Menu,
  CheckCheck,
  Trash2,
  Eye,
  EyeOff,
  Boxes,
  Search,
  PackageX,
  PackageCheck,
  ShoppingBag,
  Upload,
  RotateCcw,
  MapPin,
  Truck,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  FileText,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  Stethoscope,
} from 'lucide-react';
import {
  clearAllContacts,
  deleteContact,
  markContactRead,
  subscribeContacts,
} from '../services/contacts';
import { deleteConsultation, subscribeConsultations } from '../services/consultations';
import {
  deleteOrder,
  subscribeOrders,
  updateOrderStatus,
} from '../services/orders';
import {
  addRemedy,
  dedupeRemedies,
  getLocalCatalog,
  seedDefaultRemedies,
  subscribeRemedies,
  subscribeRemediesHeader,
  toggleRemedyLiveStatus,
  toggleRemedyStockStatus,
  updateRemediesHeader,
  updateRemedy,
} from '../services/remedies';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS = [
  { id: 'contacts', label: 'Contacts', icon: MessageSquare },
  { id: 'consultations', label: 'Consultations Booked', icon: Stethoscope },
  { id: 'orders', label: 'Orders Placed', icon: ShoppingBag },
  { id: 'remedies', label: 'Remedies', icon: Pill },
  { id: 'add', label: 'Add Remedy', icon: Plus },
];

const emptyRemedy = {
  name: '',
  scientificName: '',
  category: '',
  description: '',
  price: '',
  minQuantity: '1',
  stock: '30',
  isLive: true,
  inStock: true,
  benefits: '',
  image: '',
};

function formatDate(date) {
  if (!date) return 'Just now';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminPage({ addToast }) {
  const { user, loading: authLoading, isAdmin, logout } = useAuth();
  const [tab, setTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [remedies, setRemedies] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingRemedies, setLoadingRemedies] = useState(true);
  const [dataError, setDataError] = useState('');
  const [consultationSearch, setConsultationSearch] = useState('');
  const [consultationBusyId, setConsultationBusyId] = useState(null);
  const [copiedConsultId, setCopiedConsultId] = useState(null);
  const [remedyForm, setRemedyForm] = useState(emptyRemedy);
  const [editingId, setEditingId] = useState(null);
  const [savingRemedy, setSavingRemedy] = useState(false);
  const [remedyBusyId, setRemedyBusyId] = useState(null);
  const [remedyFilter, setRemedyFilter] = useState('all'); // 'all' | 'live' | 'notlive' | 'instock' | 'outofstock'
  const [remedySearch, setRemedySearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'pending' | 'processing' | 'dispatched' | 'delivered' | 'cancelled'
  const [orderSearch, setOrderSearch] = useState('');
  const [orderBusyId, setOrderBusyId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactBusyId, setContactBusyId] = useState(null);
  const [clearingContacts, setClearingContacts] = useState(false);
  const [headerForm, setHeaderForm] = useState({ title: '', description: '' });
  const [savingHeader, setSavingHeader] = useState(false);

  const isAuthed = Boolean(isAdmin);

  const unreadContacts = contacts.filter((c) => !c.read).length;
  const pendingOrdersCount = orders.filter((o) => (o.status || 'Pending') === 'Pending').length;

  const getMenuCount = (id) => {
    if (id === 'contacts') return unreadContacts || contacts.length;
    if (id === 'consultations') return consultations.length;
    if (id === 'orders') return pendingOrdersCount || orders.length;
    if (id === 'remedies') return remedies.length;
    return null;
  };

  const selectTab = (nextTab) => {
    if (nextTab === 'add' && tab !== 'add') {
      setEditingId(null);
      setRemedyForm(emptyRemedy);
    }
    setTab(nextTab);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!isAuthed) return undefined;

    setLoadingContacts(true);
    setLoadingConsultations(true);
    setLoadingOrders(true);
    setLoadingRemedies(true);

    let unsubContacts = () => {};
    let unsubConsultations = () => {};
    let unsubOrders = () => {};
    let unsubRemedies = () => {};
    let unsubHeader = () => {};
    let cancelled = false;

    // Subscribe immediately — do not wait for seed (seed can hang on slow/blocked Firestore)
    unsubContacts = subscribeContacts(
      (items) => {
        setContacts(items);
        setLoadingContacts(false);
        setDataError('');
      },
      (err) => {
        console.error(err);
        setLoadingContacts(false);
        setDataError('Could not load data. Check Firestore rules and that the database is created.');
      }
    );

    unsubConsultations = subscribeConsultations(
      (items) => {
        setConsultations(items);
        setLoadingConsultations(false);
      },
      (err) => {
        console.error(err);
        setLoadingConsultations(false);
        setDataError('Could not load consultations. Check Firestore rules and that the database is created.');
      }
    );

    unsubOrders = subscribeOrders(
      (items) => {
        if (cancelled) return;
        setOrders(items);
        setLoadingOrders(false);
      },
      (err) => {
        console.error('Failed to load orders:', err);
        if (cancelled) return;
        setLoadingOrders(false);
      }
    );

    let remediesLoaded = false;

    unsubRemedies = subscribeRemedies(
      (items) => {
        if (cancelled) return;
        remediesLoaded = true;
        const distinct = dedupeRemedies(items);
        setRemedies(distinct.length > 0 ? distinct : getLocalCatalog());
        setLoadingRemedies(false);
      },
      (err) => {
        console.error(err);
        if (cancelled) return;
        remediesLoaded = true;
        setRemedies(getLocalCatalog());
        setLoadingRemedies(false);
        setDataError('Could not load remedies from Firebase — showing local catalog.');
      }
    );

    unsubHeader = subscribeRemediesHeader(
      (data) => {
        if (cancelled) return;
        setHeaderForm({
          title: data.title || '',
          description: data.description || '',
        });
      },
      (err) => {
        console.error('Failed to load header configurations:', err);
      }
    );

    const remediesTimeout = setTimeout(() => {
      if (cancelled || remediesLoaded) return;
      setRemedies((prev) => (prev.length > 0 ? prev : getLocalCatalog()));
      setLoadingRemedies(false);
    }, 8000);

    seedDefaultRemedies().catch((err) => {
      console.error(err);
      if (!cancelled) {
        setDataError('Could not seed remedies. Check Firestore rules and that the database is created.');
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(remediesTimeout);
      unsubContacts();
      unsubConsultations();
      unsubOrders();
      unsubRemedies();
      unsubHeader();
    };
  }, [isAuthed]);

  const handleLogout = async () => {
    setTab('contacts');
    setEditingId(null);
    setRemedyForm(emptyRemedy);
    setMenuOpen(false);
    try {
      await logout();
      addToast?.({
        title: 'Signed out',
        message: 'Admin session ended.',
        type: 'info',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkContact = async (item) => {
    setContactBusyId(item.id);
    try {
      await markContactRead(item.id, !item.read);
      addToast?.({
        title: item.read ? 'Marked Unread' : 'Marked Read',
        message: item.read ? 'Message moved back to unread.' : 'Message marked as read.',
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      addToast?.({
        title: 'Update Failed',
        message: 'Could not update message status.',
        type: 'error',
      });
    } finally {
      setContactBusyId(null);
    }
  };

  const handleClearContact = async (item) => {
    if (!window.confirm(`Clear message from ${item.name}?`)) return;
    setContactBusyId(item.id);
    try {
      await deleteContact(item.id);
      addToast?.({
        title: 'Cleared',
        message: 'Contact message removed.',
        type: 'info',
      });
    } catch (err) {
      console.error(err);
      addToast?.({
        title: 'Clear Failed',
        message: 'Could not delete this message.',
        type: 'error',
      });
    } finally {
      setContactBusyId(null);
    }
  };

  const handleClearAllContacts = async () => {
    if (!contacts.length) return;
    if (!window.confirm(`Clear all ${contacts.length} contact messages?`)) return;
    setClearingContacts(true);
    try {
      await clearAllContacts();
      addToast?.({
        title: 'Inbox Cleared',
        message: 'All contact messages were removed.',
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      addToast?.({
        title: 'Clear Failed',
        message: 'Could not clear contacts.',
        type: 'error',
      });
    } finally {
      setClearingContacts(false);
    }
  };

  const handleRemedyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRemedyForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast?.({
        title: 'Invalid File',
        message: 'Please select an image file (PNG, JPG, WebP, etc.).',
        type: 'warning',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Compress and scale image for fast storage & syncing
        const canvas = document.createElement('canvas');
        const MAX_DIM = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/webp', 0.82);
        setRemedyForm((prev) => ({ ...prev, image: dataUrl }));
        addToast?.({
          title: 'Image Loaded',
          message: 'Product image selected and optimized.',
          type: 'info',
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const startEditRemedy = (remedy) => {
    setEditingId(remedy.id);
    const isLive = remedy.isLive !== false;
    const inStock =
      remedy.inStock !== false &&
      (remedy.stock == null || Number(remedy.stock) > 0);

    setRemedyForm({
      name: remedy.name || '',
      scientificName: remedy.scientificName || '',
      category: remedy.category || '',
      description: remedy.description || '',
      price: String(remedy.price ?? ''),
      minQuantity: String(remedy.minQuantity ?? 1),
      stock: String(remedy.stock ?? (inStock ? 30 : 0)),
      isLive,
      inStock,
      benefits: Array.isArray(remedy.benefits) ? remedy.benefits.join(', ') : '',
      image: remedy.image || '',
    });
    setTab('add');
    setMenuOpen(false);
  };

  const cancelEditRemedy = () => {
    setEditingId(null);
    setRemedyForm(emptyRemedy);
  };

  /** Toggle whether remedy is shown on the website (Live) or hidden (Not Live) */
  const handleToggleLive = async (remedy) => {
    setRemedyBusyId(remedy.id);
    const currentlyLive = remedy.isLive !== false;
    const nextLive = !currentlyLive;

    // Optimistic local update (does not affect stock status)
    setRemedies((prev) =>
      prev.map((item) =>
        item.id === remedy.id ? { ...item, isLive: nextLive } : item
      )
    );

    try {
      await toggleRemedyLiveStatus(remedy.id, currentlyLive);
      addToast?.({
        title: nextLive ? 'Remedy Is Now Live' : 'Remedy Set To Not Live',
        message: nextLive
          ? `"${remedy.name}" is now visible to customers on the website.`
          : `"${remedy.name}" is now hidden and will not be shown on the website.`,
        type: nextLive ? 'success' : 'info',
      });
    } catch (err) {
      console.error(err);
      addToast?.({
        title: 'Status Update Failed',
        message: 'Could not update website visibility.',
        type: 'error',
      });
      setRemedies((prev) =>
        prev.map((item) =>
          item.id === remedy.id ? { ...item, isLive: currentlyLive } : item
        )
      );
    } finally {
      setRemedyBusyId(null);
    }
  };

  /** Toggle whether remedy is In Stock or Out of Stock (independent of website visibility) */
  const handleToggleStock = async (remedy) => {
    setRemedyBusyId(remedy.id);
    const currentlyInStock =
      remedy.inStock !== false &&
      (remedy.stock == null || Number(remedy.stock) > 0);
    const nextInStock = !currentlyInStock;
    const nextStock = nextInStock ? (remedy.stock > 0 ? remedy.stock : 30) : 0;

    // Optimistic local update (does not affect website visibility)
    setRemedies((prev) =>
      prev.map((item) =>
        item.id === remedy.id
          ? { ...item, inStock: nextInStock, stock: nextStock }
          : item
      )
    );

    try {
      await toggleRemedyStockStatus(remedy.id, currentlyInStock);
      addToast?.({
        title: nextInStock ? 'Marked In Stock' : 'Marked Out of Stock',
        message: nextInStock
          ? `"${remedy.name}" is now marked In Stock.`
          : `"${remedy.name}" is now marked Out of Stock on the storefront.`,
        type: nextInStock ? 'success' : 'warning',
      });
    } catch (err) {
      console.error(err);
      addToast?.({
        title: 'Stock Update Failed',
        message: 'Could not update stock status.',
        type: 'error',
      });
      setRemedies((prev) =>
        prev.map((item) =>
          item.id === remedy.id
            ? { ...item, inStock: currentlyInStock, stock: remedy.stock }
            : item
        )
      );
    } finally {
      setRemedyBusyId(null);
    }
  };

  const handleSaveRemedy = async (e) => {
    e.preventDefault();
    if (!remedyForm.name.trim() || !remedyForm.price) {
      addToast?.({
        title: 'Missing Info',
        message: 'Remedy name and price are required.',
        type: 'warning',
      });
      return;
    }

    setSavingRemedy(true);
    const existingRemedy = editingId ? remedies.find((r) => r.id === editingId) : null;
    const finalImage = remedyForm.image || existingRemedy?.image || '/remedy-bottle.png';

    const payload = {
      ...remedyForm,
      image: finalImage,
      isLive: Boolean(remedyForm.isLive),
      inStock: Boolean(remedyForm.inStock),
      stock:
        Number(remedyForm.stock) ||
        (remedyForm.inStock ? 30 : 0),
    };

    try {
      if (editingId) {
        await updateRemedy(editingId, payload);
        // Also update local remedies state optimistically
        setRemedies((prev) =>
          prev.map((r) => (r.id === editingId ? { ...r, ...payload, id: editingId } : r))
        );
        addToast?.({
          title: 'Remedy Updated',
          message: 'Changes, image, visibility, and stock are saved.',
          type: 'success',
        });
      } else {
        const newId = await addRemedy(payload);
        setRemedies((prev) => [
          ...prev,
          {
            ...payload,
            id: newId,
            createdAt: new Date(),
            fromFirestore: true,
          },
        ]);
        addToast?.({
          title: 'Remedy Added',
          message: payload.isLive
            ? 'The new remedy is published on the website.'
            : 'The new remedy is saved (Not Live / Hidden).',
          type: 'success',
        });
      }
      setEditingId(null);
      setRemedyForm(emptyRemedy);
      setTab('remedies');
    } catch (err) {
      console.error(err);
      addToast?.({
        title: 'Save Failed',
        message:
          err?.code === 'remedy/duplicate-name'
            ? 'A remedy with this name already exists.'
            : editingId
              ? 'Could not update remedy. Check Firestore permissions.'
              : 'Could not add remedy. Check Firestore permissions.',
        type: 'error',
      });
    } finally {
      setSavingRemedy(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrderBusyId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      addToast?.({
        title: 'Status Updated',
        message: `Order marked as "${newStatus}".`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to update order status:', err);
      addToast?.({
        title: 'Update Failed',
        message: 'Could not update order status.',
        type: 'error',
      });
    } finally {
      setOrderBusyId(null);
    }
  };

  const handleDeleteOrder = async (order) => {
    const orderTitle = order.orderNumber ? `#${order.orderNumber}` : 'this order';
    if (!window.confirm(`Are you sure you want to delete ${orderTitle} for ${order.patient?.name || 'patient'}?`)) {
      return;
    }
    setOrderBusyId(order.id);
    try {
      await deleteOrder(order.id);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      addToast?.({
        title: 'Order Deleted',
        message: `Order ${orderTitle} was deleted.`,
        type: 'info',
      });
    } catch (err) {
      console.error('Failed to delete order:', err);
      addToast?.({
        title: 'Delete Failed',
        message: 'Could not delete order.',
        type: 'error',
      });
    } finally {
      setOrderBusyId(null);
    }
  };

  const handleSaveHeader = async (e) => {
    e.preventDefault();
    if (!headerForm.title.trim() || !headerForm.description.trim()) {
      addToast?.({
        title: 'Missing Info',
        message: 'Title and description are required.',
        type: 'warning',
      });
      return;
    }

    setSavingHeader(true);
    try {
      await updateRemediesHeader(headerForm);
      addToast?.({
        title: 'Header Updated',
        message: 'Storefront remedies header was successfully updated.',
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      addToast?.({
        title: 'Save Failed',
        message: 'Could not update storefront header settings.',
        type: 'error',
      });
    } finally {
      setSavingHeader(false);
    }
  };

  if (authLoading) {
    return (
      <div className="admin-page">
        <div className="admin-login-wrap">
          <div className="admin-login-card glass admin-auth-status">
            <Loader2 className="admin-spin" size={28} />
            <p>Checking admin access…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !isAdmin) {
    return <Navigate to="/login" replace state={{ from: '/admin' }} />;
  }

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-login-wrap">
          <div className="admin-login-card glass">
            <div className="admin-login-badge">
              <ShieldCheck size={18} />
              Admin Access
            </div>
            <img
              src="/medi-drop-logo-full.png"
              alt="MEDI DROP"
              className="admin-login-logo"
            />
            <h1>Access denied</h1>
            <p>
              You’re signed in as <strong>{user.email}</strong>, but this account is not an admin.
              Sign in with an admin account from the login page.
            </p>
            <Link to="/login" className="btn btn-primary admin-login-btn" state={{ from: '/admin' }}>
              Go to Login
            </Link>
            <button type="button" className="btn btn-outline admin-login-btn" onClick={handleLogout}>
              Sign out
            </button>
            <Link to="/" className="admin-back-link">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-page ${menuOpen ? 'admin-menu-open' : ''}`}>
      <header className="admin-topbar">
        <Link to="/" className="admin-brand" aria-label="MEDI DROP home">
          <img
            src="/medi-drop-logo-full.png"
            alt="MEDI DROP"
            className="admin-brand-logo"
          />
          <span className="admin-brand-tag">Admin</span>
        </Link>

        <div className="admin-top-actions">
          <Link to="/" className="admin-link-btn">
            View site
          </Link>
          <button type="button" className="btn btn-outline admin-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span className="admin-logout-label">Logout</span>
          </button>
          <button
            type="button"
            className="admin-menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="admin-menu-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <nav className={`admin-menubar ${menuOpen ? 'is-open' : ''}`} aria-label="Admin sections">
        {MENU_ITEMS.map(({ id, label, icon: Icon }) => {
          const count = getMenuCount(id);
          const isActive = tab === id || (id === 'add' && editingId && tab === 'add');
          return (
            <button
              key={id}
              type="button"
              className={`admin-menubar-btn ${isActive ? 'active' : ''}`}
              onClick={() => selectTab(id)}
            >
              <Icon size={16} />
              <span>{id === 'add' && editingId ? 'Edit Remedy' : label}</span>
              {count != null && (
                <span className={`admin-count ${id === 'contacts' && unreadContacts ? 'admin-count-unread' : ''}`}>
                  {id === 'contacts' && unreadContacts ? unreadContacts : count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <main className="admin-main">
          {dataError && <div className="admin-banner">{dataError}</div>}

          {tab === 'contacts' && (
            <section className="admin-panel">
              <div className="admin-panel-head admin-panel-head-row">
                <div>
                  <h2>Contact form submissions</h2>
                  <p>
                    {unreadContacts
                      ? `${unreadContacts} unread · ${contacts.length} total`
                      : 'Messages sent from the public contact page.'}
                  </p>
                </div>
                {contacts.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline admin-clear-all"
                    onClick={handleClearAllContacts}
                    disabled={clearingContacts}
                  >
                    {clearingContacts ? (
                      <Loader2 className="admin-spin" size={15} />
                    ) : (
                      <Trash2 size={15} />
                    )}
                    Clear all
                  </button>
                )}
              </div>

              {loadingContacts ? (
                <div className="admin-empty">
                  <Loader2 className="admin-spin" size={22} />
                  Loading messages…
                </div>
              ) : contacts.length === 0 ? (
                <div className="admin-empty">No contact messages yet.</div>
              ) : (
                <div className="admin-contact-list">
                  {contacts.map((item) => (
                    <article
                      key={item.id}
                      className={`admin-contact-card ${item.read ? 'is-read' : 'is-unread'}`}
                    >
                      <div className="admin-contact-top">
                        <div className="admin-contact-title">
                          {!item.read && <span className="admin-unread-dot" aria-label="Unread" />}
                          <h3>{item.name}</h3>
                          {item.read ? (
                            <span className="admin-status-pill is-read-pill">Read</span>
                          ) : (
                            <span className="admin-status-pill is-unread-pill">Unread</span>
                          )}
                        </div>
                        <span>
                          <Clock size={13} />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      {item.subject && <p className="admin-subject">{item.subject}</p>}
                      <p className="admin-message">{item.message}</p>
                      <div className="admin-contact-meta">
                        <a href={`mailto:${item.email}`}>
                          <Mail size={14} />
                          {item.email}
                        </a>
                        {item.phone && (
                          <a href={`tel:${item.phone}`}>
                            <Phone size={14} />
                            {item.phone}
                          </a>
                        )}
                      </div>
                      <div className="admin-contact-actions">
                        <button
                          type="button"
                          className="admin-action-btn"
                          onClick={() => handleMarkContact(item)}
                          disabled={contactBusyId === item.id}
                        >
                          {contactBusyId === item.id ? (
                            <Loader2 className="admin-spin" size={14} />
                          ) : item.read ? (
                            <EyeOff size={14} />
                          ) : (
                            <CheckCheck size={14} />
                          )}
                          {item.read ? 'Mark unread' : 'Mark as read'}
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn admin-action-danger"
                          onClick={() => handleClearContact(item)}
                          disabled={contactBusyId === item.id}
                        >
                          <Trash2 size={14} />
                          Clear
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === 'consultations' && (() => {
            const filteredConsultations = consultations.filter((item) => {
              if (!consultationSearch.trim()) return true;
              const term = consultationSearch.toLowerCase();
              const name = (item.name || '').toLowerCase();
              const email = (item.email || '').toLowerCase();
              const phone = (item.phone || '').toLowerCase();
              const symptoms = (item.symptoms || '').toLowerCase();
              const txn = (item.upiLast4 || item.upiRefNo || '').toLowerCase();
              const id = (item.id || item.readableId || '').toLowerCase();
              return (
                name.includes(term) ||
                email.includes(term) ||
                phone.includes(term) ||
                symptoms.includes(term) ||
                txn.includes(term) ||
                id.includes(term)
              );
            });

            const handleDeleteConsultation = async (id, name) => {
              if (!window.confirm(`Are you sure you want to remove consultation booking for ${name || 'this patient'}?`)) {
                return;
              }
              setConsultationBusyId(id);
              try {
                await deleteConsultation(id);
                addToast({
                  title: 'Booking Removed',
                  message: `Consultation for ${name || 'patient'} has been removed.`,
                  type: 'info',
                });
              } catch (err) {
                console.error('Delete consultation error:', err);
                addToast({
                  title: 'Error',
                  message: 'Could not remove consultation.',
                  type: 'error',
                });
              } finally {
                setConsultationBusyId(null);
              }
            };

            return (
              <section className="admin-panel">
                <div className="admin-panel-head admin-panel-head-row">
                  <div>
                    <h2>Consultations Booked</h2>
                    <p>
                      {consultations.length === 1
                        ? '1 patient appointment booked'
                        : `${consultations.length} total patient appointments booked`}
                      {' · '}
                      ₹{(consultations.length * 99).toLocaleString('en-IN')} total revenue collected via UPI
                    </p>
                  </div>
                </div>

                {/* Consultation Metric Summary Cards */}
                <div className="admin-order-stats-grid">
                  <div className="admin-stat-summary-card">
                    <div className="admin-stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <span className="admin-stat-val">{consultations.length}</span>
                      <span className="admin-stat-lbl">Booked Sessions</span>
                    </div>
                  </div>

                  <div className="admin-stat-summary-card">
                    <div className="admin-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                      <IndianRupee size={20} />
                    </div>
                    <div>
                      <span className="admin-stat-val" style={{ color: '#10b981' }}>
                        ₹{(consultations.length * 99).toLocaleString('en-IN')}
                      </span>
                      <span className="admin-stat-lbl">Fee Collected</span>
                    </div>
                  </div>

                  <div className="admin-stat-summary-card">
                    <div className="admin-stat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <span className="admin-stat-val" style={{ color: '#8b5cf6' }}>100%</span>
                      <span className="admin-stat-lbl">UPI Payment</span>
                    </div>
                  </div>

                  <div className="admin-stat-summary-card">
                    <div className="admin-stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.14)', color: '#f59e0b' }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <span className="admin-stat-val" style={{ fontSize: '1.05rem', color: '#f59e0b' }}>9746758698</span>
                      <span className="admin-stat-lbl">Clinic Helpline</span>
                    </div>
                  </div>
                </div>

                {/* Consultation Search Toolbar */}
                <div className="admin-toolbar" style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="admin-search-wrap" style={{ maxWidth: '420px', flex: 1 }}>
                    <Search size={16} className="admin-search-icon" />
                    <input
                      type="text"
                      value={consultationSearch}
                      onChange={(e) => setConsultationSearch(e.target.value)}
                      placeholder="Search by patient name, phone, symptoms, or UPI last 4..."
                      className="admin-search-input"
                    />
                    {consultationSearch && (
                      <button
                        type="button"
                        onClick={() => setConsultationSearch('')}
                        className="admin-search-clear"
                        title="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {loadingConsultations ? (
                  <div className="admin-empty">
                    <Loader2 className="admin-spin" size={22} />
                    Loading consultations…
                  </div>
                ) : filteredConsultations.length === 0 ? (
                  <div className="admin-empty">
                    {consultationSearch
                      ? `No consultations match "${consultationSearch}".`
                      : 'No consultation bookings yet.'}
                  </div>
                ) : (
                  <div className="admin-consult-grid">
                    {filteredConsultations.map((item) => {
                      const phoneDigits = (item.phone || '').replace(/\D/g, '');
                      const txnLast4 = item.upiLast4 || item.upiRefNo || '';
                      const bookingRef = item.readableId || item.id;
                      const waMsg = `Hello ${item.name || 'Patient'}, this is Dr. Ancy Shaji's clinic (MediDrop) regarding your online consultation booked for ${item.date || ''} (${item.time || ''}). We have confirmed your ₹99 UPI payment (Txn ID: ${txnLast4}).`;
                      const waUrl = phoneDigits ? `https://wa.me/91${phoneDigits.slice(-10)}?text=${encodeURIComponent(waMsg)}` : null;

                      return (
                        <article key={item.id} className="admin-consult-card">
                          <div className="admin-consult-card-head">
                            <div className="admin-consult-patient-meta">
                              <span className="admin-consult-badge-id">{bookingRef}</span>
                              <h3 className="admin-consult-patient-name">{item.name || 'Patient'}</h3>
                            </div>
                            <span className="admin-consult-time-ago">
                              <Clock size={13} />
                              {formatDate(item.createdAt)}
                            </span>
                          </div>

                          {/* Slot & Appointment Info */}
                          <div className="admin-consult-slot-bar">
                            <div className="admin-consult-slot-pill">
                              <Calendar size={14} />
                              <strong>{item.date || 'Date TBD'}</strong>
                            </div>
                            <div className="admin-consult-slot-pill">
                              <Clock size={14} />
                              <span>{item.time || 'Time TBD'}</span>
                            </div>
                          </div>

                          {/* Patient Health Concern / Symptoms */}
                          <div className="admin-consult-symptoms-box">
                            <span className="admin-consult-symptoms-label">
                              <Stethoscope size={13} /> Health Concern / Symptoms:
                            </span>
                            <p className="admin-consult-symptoms-text">
                              {item.symptoms || 'No specific symptoms described.'}
                            </p>
                          </div>

                          {/* Payment & Verification Row */}
                          <div className="admin-consult-payment-box">
                            <div className="admin-consult-pay-status">
                              <span className="admin-consult-amount-pill">₹{item.amount || 99} Paid</span>
                              <span className="admin-consult-upi-tag">UPI Verified</span>
                            </div>
                            {txnLast4 && (
                              <div className="admin-consult-utr-pill">
                                <span>Txn ID (last 4):</span>
                                <strong>{txnLast4}</strong>
                                <button
                                  type="button"
                                  className="admin-consult-copy-btn"
                                  title="Copy Last 4 Digits"
                                  onClick={() => {
                                    navigator.clipboard.writeText(txnLast4);
                                    setCopiedConsultId(item.id);
                                    setTimeout(() => setCopiedConsultId(null), 2000);
                                  }}
                                >
                                  {copiedConsultId === item.id ? <Check size={12} /> : <Copy size={12} />}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Contact Meta Details */}
                          <div className="admin-consult-patient-contacts">
                            {item.email && (
                              <a href={`mailto:${item.email}`} className="admin-consult-contact-link" title="Send Email">
                                <Mail size={13} />
                                <span>{item.email}</span>
                              </a>
                            )}
                            {item.phone && (
                              <a href={`tel:${item.phone}`} className="admin-consult-contact-link" title="Call Patient">
                                <Phone size={13} />
                                <span>{item.phone}</span>
                              </a>
                            )}
                          </div>

                          {/* Admin Action Buttons */}
                          <div className="admin-consult-actions-bar">
                            {waUrl && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline admin-consult-wa-btn"
                                title="Message patient on WhatsApp"
                              >
                                <MessageSquare size={14} />
                                <span>WhatsApp Patient</span>
                                <ExternalLink size={12} />
                              </a>
                            )}

                            {item.phone && (
                              <a
                                href={`tel:${item.phone}`}
                                className="btn btn-outline admin-consult-call-btn"
                                title="Call patient phone"
                              >
                                <Phone size={14} />
                                <span>Call</span>
                              </a>
                            )}

                            <button
                              type="button"
                              className="btn btn-outline admin-consult-delete-btn"
                              disabled={consultationBusyId === item.id}
                              onClick={() => handleDeleteConsultation(item.id, item.name)}
                              title="Remove this booking"
                            >
                              <Trash2 size={14} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })()}

          {tab === 'orders' && (
            <section className="admin-panel">
              <div className="admin-panel-head admin-panel-head-row">
                <div>
                  <h2>Patient Orders Placed</h2>
                  <p>
                    {pendingOrdersCount
                      ? `${pendingOrdersCount} pending packaging · ${orders.length} total orders`
                      : 'Orders placed by patients from their shopping cart.'}
                  </p>
                </div>
              </div>

              {/* Order Metrics Summary Cards */}
              <div className="admin-order-stats-grid">
                <div className="admin-stat-summary-card">
                  <div className="admin-stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <span className="admin-stat-val">{orders.length}</span>
                    <span className="admin-stat-lbl">Total Orders</span>
                  </div>
                </div>

                <div className="admin-stat-summary-card">
                  <div className="admin-stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.14)', color: '#f59e0b' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="admin-stat-val" style={{ color: '#f59e0b' }}>{pendingOrdersCount}</span>
                    <span className="admin-stat-lbl">Pending Packaging</span>
                  </div>
                </div>

                <div className="admin-stat-summary-card">
                  <div className="admin-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <span className="admin-stat-val" style={{ color: '#10b981' }}>
                      {orders.filter(o => o.status === 'Dispatched' || o.status === 'Delivered').length}
                    </span>
                    <span className="admin-stat-lbl">Shipped / Delivered</span>
                  </div>
                </div>

                <div className="admin-stat-summary-card">
                  <div className="admin-stat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <span className="admin-stat-val">
                      ₹{orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0).toLocaleString('en-IN')}
                    </span>
                    <span className="admin-stat-lbl">Gross Order Value</span>
                  </div>
                </div>
              </div>

              {/* Order Filter & Search Toolbar */}
              <div className="admin-toolbar" style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="admin-filter-group" role="group" aria-label="Filter orders">
                  <button
                    type="button"
                    className={`admin-filter-chip ${orderFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('all')}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-chip ${orderFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('pending')}
                  >
                    Pending ({orders.filter(o => (o.status || 'Pending').toLowerCase() === 'pending').length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-chip ${orderFilter === 'processing' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('processing')}
                  >
                    Processing ({orders.filter(o => (o.status || '').toLowerCase() === 'processing').length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-chip ${orderFilter === 'dispatched' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('dispatched')}
                  >
                    Dispatched ({orders.filter(o => (o.status || '').toLowerCase() === 'dispatched').length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-chip ${orderFilter === 'delivered' ? 'active' : ''}`}
                    onClick={() => setOrderFilter('delivered')}
                  >
                    Delivered ({orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length})
                  </button>
                </div>

                <div className="admin-search-wrap">
                  <Search size={15} />
                  <input
                    type="search"
                    className="admin-search-input"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by patient, phone, order ID..."
                  />
                  {orderSearch && (
                    <button
                      type="button"
                      className="admin-search-clear"
                      onClick={() => setOrderSearch('')}
                      aria-label="Clear search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {loadingOrders ? (
                <div className="admin-empty">
                  <Loader2 className="admin-spin" size={22} />
                  Loading patient orders…
                </div>
              ) : orders.length === 0 ? (
                <div className="admin-empty">
                  <ShoppingBag size={32} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                  <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>No orders placed yet.</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    When patients checkout remedies from their cart, their full order information will appear here in real-time.
                  </p>
                </div>
              ) : (() => {
                const filteredOrders = orders.filter((o) => {
                  const statusMatch =
                    orderFilter === 'all'
                      ? true
                      : (o.status || 'Pending').toLowerCase() === orderFilter.toLowerCase();

                  if (!statusMatch) return false;
                  if (!orderSearch.trim()) return true;

                  const term = orderSearch.toLowerCase().trim();
                  const patientName = (o.patient?.name || '').toLowerCase();
                  const patientPhone = (o.patient?.phone || '').toLowerCase();
                  const patientEmail = (o.patient?.email || '').toLowerCase();
                  const patientAddress = (o.patient?.address || '').toLowerCase();
                  const orderNum = (o.orderNumber || o.id || '').toLowerCase();
                  const itemNames = (o.items || []).map((i) => (i.name || '').toLowerCase()).join(' ');

                  return (
                    patientName.includes(term) ||
                    patientPhone.includes(term) ||
                    patientEmail.includes(term) ||
                    patientAddress.includes(term) ||
                    orderNum.includes(term) ||
                    itemNames.includes(term)
                  );
                });

                if (filteredOrders.length === 0) {
                  return (
                    <div className="admin-empty">
                      No orders match your search or filter.
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ marginTop: '0.75rem' }}
                        onClick={() => {
                          setOrderFilter('all');
                          setOrderSearch('');
                        }}
                      >
                        Reset filters
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="admin-orders-list">
                    {filteredOrders.map((order) => {
                      const status = order.status || 'Pending';
                      const isBusy = orderBusyId === order.id;

                      return (
                        <article key={order.id} className="admin-order-card glass">
                          {/* Order Header */}
                          <div className="admin-order-header">
                            <div className="admin-order-header-left">
                              <div className="admin-order-id-badge">
                                <ShoppingBag size={14} />
                                <span>Order #{order.orderNumber || order.id.slice(-6)}</span>
                              </div>
                              <span className="admin-order-time">
                                <Clock size={13} />
                                {formatDate(order.createdAt)}
                              </span>
                            </div>

                            <div className="admin-order-header-right">
                              {/* Fulfillment Status Dropdown */}
                              <div className="admin-order-status-control">
                                <label htmlFor={`order-status-${order.id}`} className="admin-visually-hidden">
                                  Order Status
                                </label>
                                <select
                                  id={`order-status-${order.id}`}
                                  className={`admin-order-status-select status-${status.toLowerCase()}`}
                                  value={status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  disabled={isBusy}
                                >
                                  <option value="Pending">🟡 Pending</option>
                                  <option value="Processing">🔵 Processing</option>
                                  <option value="Dispatched">🟣 Dispatched</option>
                                  <option value="Delivered">🟢 Delivered</option>
                                  <option value="Cancelled">🔴 Cancelled</option>
                                </select>
                              </div>

                              <button
                                type="button"
                                className="admin-action-btn admin-action-danger"
                                onClick={() => handleDeleteOrder(order)}
                                disabled={isBusy}
                                title="Delete this order"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Order Body (2 Columns on Desktop) */}
                          <div className="admin-order-body-grid">
                            {/* Column 1: Patient Information */}
                            <div className="admin-order-patient-panel">
                              <h4>Patient & Delivery Details</h4>
                              <div className="admin-order-patient-info">
                                <div className="admin-order-info-row">
                                  <span className="admin-info-label">Patient Name:</span>
                                  <strong>{order.patient?.name || '—'}</strong>
                                </div>
                                <div className="admin-order-info-row">
                                  <span className="admin-info-label">Contact Phone:</span>
                                  {order.patient?.phone ? (
                                    <a href={`tel:${order.patient.phone}`} className="admin-order-link">
                                      <Phone size={13} />
                                      <span>{order.patient.phone}</span>
                                    </a>
                                  ) : (
                                    <span>—</span>
                                  )}
                                </div>
                                <div className="admin-order-info-row">
                                  <span className="admin-info-label">Email Address:</span>
                                  {order.patient?.email ? (
                                    <a href={`mailto:${order.patient.email}`} className="admin-order-link">
                                      <Mail size={13} />
                                      <span>{order.patient.email}</span>
                                    </a>
                                  ) : (
                                    <span>—</span>
                                  )}
                                </div>
                                <div className="admin-order-info-row admin-order-address-row">
                                  <span className="admin-info-label">Shipping Address:</span>
                                  <div className="admin-order-address-text">
                                    <MapPin size={13} />
                                    <span>{order.patient?.address || '—'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Column 2: Placed Products */}
                            <div className="admin-order-items-panel">
                              <h4>Products Ordered ({order.items?.length || 0} items)</h4>
                              <div className="admin-order-items-table-wrap">
                                <table className="admin-order-items-table">
                                  <thead>
                                    <tr>
                                      <th>Item</th>
                                      <th>Price</th>
                                      <th>Qty</th>
                                      <th style={{ textAlign: 'right' }}>Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(order.items || []).map((item, idx) => (
                                      <tr key={idx}>
                                        <td>
                                          <div className="admin-order-item-cell">
                                            <img
                                              src={item.image || '/remedy-bottle.png'}
                                              alt={item.name}
                                              className="admin-order-item-thumb"
                                            />
                                            <div>
                                              <strong>{item.name}</strong>
                                              {item.scientificName && <span>{item.scientificName}</span>}
                                            </div>
                                          </div>
                                        </td>
                                        <td>₹{item.price}</td>
                                        <td>
                                          <span className="admin-order-qty-pill">x {item.quantity}</span>
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: '650' }}>
                                          ₹{item.subtotal || item.price * item.quantity}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Financial Summary */}
                              <div className="admin-order-totals">
                                <div className="admin-order-total-line">
                                  <span>Items Subtotal:</span>
                                  <span>₹{order.subtotal || 0}</span>
                                </div>
                                <div className="admin-order-total-line">
                                  <span>Delivery Charges:</span>
                                  <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
                                </div>
                                <div className="admin-order-total-line admin-order-grand-total">
                                  <strong>Total Amount:</strong>
                                  <strong>₹{order.total || 0}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                );
              })()}
            </section>
          )}

          {tab === 'remedies' && (
            <section className="admin-panel">
              <div className="admin-panel-head">
                <h2>All remedies</h2>
                <p>Catalog stored in Firebase — includes the original 10 remedies plus any you add.</p>
              </div>

              <div className="admin-login-card glass" style={{ width: '100%', maxWidth: 'none', margin: '0 0 2rem 0', padding: '1.5rem', textAlign: 'left', display: 'block' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '750', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Storefront remedies header</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Customize the title and description shown on the remedies storefront section.</p>
                <form onSubmit={handleSaveHeader} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="admin-field" style={{ width: '100%' }}>
                      <label htmlFor="header-title" style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Section Title</label>
                      <input
                        id="header-title"
                        className="admin-input"
                        value={headerForm.title}
                        onChange={(e) => setHeaderForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Select Homeopathic Remedies"
                        required
                      />
                    </div>
                    <div className="admin-field" style={{ width: '100%' }}>
                      <label htmlFor="header-desc" style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Section Description</label>
                      <textarea
                        id="header-desc"
                        className="admin-input admin-textarea"
                        rows={2}
                        value={headerForm.description}
                        onChange={(e) => setHeaderForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Explore pure organic dilutions prepared with care..."
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', minHeight: '2.4rem', padding: '0.5rem 1.25rem' }} disabled={savingHeader}>
                    {savingHeader ? (
                      <>
                        <Loader2 className="admin-spin" size={15} />
                        Saving...
                      </>
                    ) : 'Update Storefront Header'}
                  </button>
                </form>
              </div>

              {loadingRemedies ? (
                <div className="admin-empty">
                  <Loader2 className="admin-spin" size={22} />
                  Loading remedies…
                </div>
              ) : remedies.length === 0 ? (
                <div className="admin-empty">
                  No remedies in Firebase yet.
                  <button type="button" className="btn btn-primary" onClick={() => setTab('add')}>
                    <Plus size={16} />
                    Add first remedy
                  </button>
                </div>
              ) : (
                (() => {
                  const totalRemedies = remedies.length;
                  const liveCount = remedies.filter((r) => r.isLive !== false).length;
                  const notLiveCount = totalRemedies - liveCount;
                  const inStockCount = remedies.filter(
                    (r) => r.inStock !== false && (r.stock == null || Number(r.stock) > 0)
                  ).length;
                  const outOfStockCount = totalRemedies - inStockCount;

                  const filteredRemedies = remedies.filter((r) => {
                    const isLive = r.isLive !== false;
                    const inStock = r.inStock !== false && (r.stock == null || Number(r.stock) > 0);

                    if (remedyFilter === 'live' && !isLive) return false;
                    if (remedyFilter === 'notlive' && isLive) return false;
                    if (remedyFilter === 'instock' && !inStock) return false;
                    if (remedyFilter === 'outofstock' && inStock) return false;

                    if (remedySearch.trim()) {
                      const q = remedySearch.toLowerCase().trim();
                      const name = (r.name || '').toLowerCase();
                      const sci = (r.scientificName || '').toLowerCase();
                      const cat = (r.category || '').toLowerCase();
                      return name.includes(q) || sci.includes(q) || cat.includes(q);
                    }
                    return true;
                  });

                  return (
                    <>
                      <div className="admin-remedies-toolbar">
                        <div className="admin-stock-pills" role="tablist" aria-label="Filter remedies by stock and visibility">
                          <button
                            type="button"
                            className={`admin-filter-pill ${remedyFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setRemedyFilter('all')}
                          >
                            All ({totalRemedies})
                          </button>
                          <button
                            type="button"
                            className={`admin-filter-pill is-live-filter ${remedyFilter === 'live' ? 'active' : ''}`}
                            onClick={() => setRemedyFilter('live')}
                            title="Remedies visible on public website"
                          >
                            <span className="admin-filter-dot is-live" />
                            Live on Web ({liveCount})
                          </button>
                          <button
                            type="button"
                            className={`admin-filter-pill is-notlive-filter ${remedyFilter === 'notlive' ? 'active' : ''}`}
                            onClick={() => setRemedyFilter('notlive')}
                            title="Remedies hidden from public website"
                          >
                            <span className="admin-filter-dot is-notlive" />
                            Not Live / Hidden ({notLiveCount})
                          </button>
                          <button
                            type="button"
                            className={`admin-filter-pill ${remedyFilter === 'instock' ? 'active' : ''}`}
                            onClick={() => setRemedyFilter('instock')}
                            title="Remedies with stock available"
                          >
                            In Stock ({inStockCount})
                          </button>
                          <button
                            type="button"
                            className={`admin-filter-pill is-outofstock-filter ${remedyFilter === 'outofstock' ? 'active' : ''}`}
                            onClick={() => setRemedyFilter('outofstock')}
                            title="Remedies marked out of stock"
                          >
                            Out of Stock ({outOfStockCount})
                          </button>
                        </div>

                        <div className="admin-search-box">
                          <Search size={14} className="admin-search-icon" />
                          <input
                            type="text"
                            className="admin-search-input"
                            placeholder="Filter by name, botanical, category..."
                            value={remedySearch}
                            onChange={(e) => setRemedySearch(e.target.value)}
                          />
                          {remedySearch && (
                            <button
                              type="button"
                              className="admin-search-clear"
                              onClick={() => setRemedySearch('')}
                              aria-label="Clear search"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {filteredRemedies.length === 0 ? (
                        <div className="admin-empty" style={{ padding: '2.5rem 1rem' }}>
                          No remedies match the filter &ldquo;{remedyFilter}&rdquo; {remedySearch ? `with search "${remedySearch}"` : ''}.
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ marginTop: '0.5rem' }}
                            onClick={() => {
                              setRemedyFilter('all');
                              setRemedySearch('');
                            }}
                          >
                            Reset filters
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="admin-remedy-table-wrap admin-remedy-desktop">
                            <table className="admin-remedy-table">
                              <thead>
                                <tr>
                                  <th>Remedy</th>
                                  <th>Category</th>
                                  <th>Price</th>
                                  <th>Stock Status</th>
                                  <th>Website Status</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredRemedies.map((r) => {
                                  const isLive = r.isLive !== false;
                                  const inStock =
                                    r.inStock !== false &&
                                    (r.stock == null || Number(r.stock) > 0);
                                  const stockQty = r.stock != null ? r.stock : (inStock ? 30 : 0);
                                  const isBusy = remedyBusyId === r.id;

                                  return (
                                    <tr key={r.id} className={!isLive ? 'is-row-notlive' : ''}>
                                      <td>
                                        <div className="admin-product-cell">
                                          <img
                                            src={r.image || '/remedy-bottle.png'}
                                            alt={r.name}
                                            className="admin-product-row-thumb"
                                            loading="lazy"
                                          />
                                          <div>
                                            <strong>{r.name}</strong>
                                            <span>{r.scientificName || 'Standard Homeopathic Dilution'}</span>
                                          </div>
                                        </div>
                                      </td>
                                      <td>{r.category || '—'}</td>
                                      <td>₹{r.price}</td>
                                      <td>
                                        {inStock ? (
                                          <div className="admin-stock-badge in-stock">
                                            <Boxes size={13} />
                                            <span>In Stock ({stockQty} units)</span>
                                          </div>
                                        ) : (
                                          <div className="admin-stock-badge out-of-stock">
                                            <PackageX size={13} />
                                            <span>Out of Stock</span>
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        {isLive ? (
                                          <span className="admin-status-pill is-live-pill" title="Shown on customer website">
                                            <span className="admin-live-dot" /> Live (Shown)
                                          </span>
                                        ) : (
                                          <span className="admin-status-pill is-notlive-pill" title="Not shown on website (Hidden completely)">
                                            <EyeOff size={11} /> Not Live (Hidden)
                                          </span>
                                        )}
                                      </td>
                                      <td>
                                        <div className="admin-row-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                          {/* Separate Stock Button */}
                                          {inStock ? (
                                            <button
                                              type="button"
                                              className="admin-action-btn admin-btn-stock-out"
                                              onClick={() => handleToggleStock(r)}
                                              disabled={isBusy}
                                              title="Mark this item as Out of Stock on the website"
                                            >
                                              {isBusy ? <Loader2 className="admin-spin" size={13} /> : <PackageX size={13} />}
                                              <span>Out of Stock</span>
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              className="admin-action-btn admin-btn-stock-in"
                                              onClick={() => handleToggleStock(r)}
                                              disabled={isBusy}
                                              title="Mark this item as In Stock"
                                            >
                                              {isBusy ? <Loader2 className="admin-spin" size={13} /> : <PackageCheck size={13} />}
                                              <span>In Stock</span>
                                            </button>
                                          )}

                                          {/* Separate Live Button (Not Live specifies not to be shown in website) */}
                                          {isLive ? (
                                            <button
                                              type="button"
                                              className="admin-action-btn admin-btn-live-hide"
                                              onClick={() => handleToggleLive(r)}
                                              disabled={isBusy}
                                              title="Hide from website (Not Live)"
                                            >
                                              {isBusy ? <Loader2 className="admin-spin" size={13} /> : <EyeOff size={13} />}
                                              <span>Make Not Live</span>
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              className="admin-action-btn admin-btn-live-show"
                                              onClick={() => handleToggleLive(r)}
                                              disabled={isBusy}
                                              title="Publish to website (Go Live)"
                                            >
                                              {isBusy ? <Loader2 className="admin-spin" size={13} /> : <Eye size={13} />}
                                              <span>Go Live</span>
                                            </button>
                                          )}

                                          <button
                                            type="button"
                                            className="admin-edit-btn"
                                            onClick={() => startEditRemedy(r)}
                                          >
                                            <Pencil size={13} />
                                            <span>Edit</span>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <div className="admin-remedy-cards admin-remedy-mobile">
                            {filteredRemedies.map((r) => {
                              const isLive = r.isLive !== false;
                              const inStock =
                                r.inStock !== false &&
                                (r.stock == null || Number(r.stock) > 0);
                              const stockQty = r.stock != null ? r.stock : (inStock ? 30 : 0);
                              const isBusy = remedyBusyId === r.id;

                              return (
                                <article key={r.id} className={`admin-remedy-card ${!isLive ? 'is-card-notlive' : ''}`}>
                                  <div className="admin-remedy-card-top">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                                      <img
                                        src={r.image || '/remedy-bottle.png'}
                                        alt={r.name}
                                        className="admin-product-row-thumb"
                                        loading="lazy"
                                      />
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                          <h3>{r.name}</h3>
                                          {isLive ? (
                                            <span className="admin-status-pill is-live-pill" style={{ padding: '0.12rem 0.45rem', fontSize: '0.65rem' }}>
                                              <span className="admin-live-dot" /> Live (Shown)
                                            </span>
                                          ) : (
                                            <span className="admin-status-pill is-notlive-pill" style={{ padding: '0.12rem 0.45rem', fontSize: '0.65rem' }}>
                                              Not Live (Hidden)
                                            </span>
                                          )}
                                          {inStock ? (
                                            <span className="admin-status-pill" style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', padding: '0.12rem 0.45rem', fontSize: '0.65rem' }}>
                                              In Stock
                                            </span>
                                          ) : (
                                            <span className="admin-status-pill" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', padding: '0.12rem 0.45rem', fontSize: '0.65rem' }}>
                                              Out of Stock
                                            </span>
                                          )}
                                        </div>
                                        {r.scientificName && <p>{r.scientificName}</p>}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      className="admin-edit-btn"
                                      onClick={() => startEditRemedy(r)}
                                    >
                                      <Pencil size={13} />
                                      Edit
                                    </button>
                                  </div>

                                  <dl className="admin-remedy-meta">
                                    <div>
                                      <dt>Category</dt>
                                      <dd>{r.category || '—'}</dd>
                                    </div>
                                    <div>
                                      <dt>Price</dt>
                                      <dd>₹{r.price}</dd>
                                    </div>
                                    <div>
                                      <dt>Stock Status</dt>
                                      <dd style={{ color: inStock ? 'var(--text-primary)' : '#ef4444' }}>
                                        {inStock ? `In Stock (${stockQty} units)` : 'Out of Stock'}
                                      </dd>
                                    </div>
                                    <div>
                                      <dt>Website Status</dt>
                                      <dd style={{ color: isLive ? '#10b981' : 'var(--text-muted)' }}>
                                        {isLive ? 'Live (Visible)' : 'Not Live (Hidden)'}
                                      </dd>
                                    </div>
                                  </dl>

                                  <div className="admin-card-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--card-border)', flexWrap: 'wrap' }}>
                                    {/* Separate Stock Button */}
                                    {inStock ? (
                                      <button
                                        type="button"
                                        className="admin-action-btn admin-btn-stock-out"
                                        style={{ flex: 1, minWidth: '120px', justifyContent: 'center' }}
                                        onClick={() => handleToggleStock(r)}
                                        disabled={isBusy}
                                      >
                                        {isBusy ? <Loader2 className="admin-spin" size={13} /> : <PackageX size={13} />}
                                        <span>Out of Stock</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="admin-action-btn admin-btn-stock-in"
                                        style={{ flex: 1, minWidth: '120px', justifyContent: 'center' }}
                                        onClick={() => handleToggleStock(r)}
                                        disabled={isBusy}
                                      >
                                        {isBusy ? <Loader2 className="admin-spin" size={13} /> : <PackageCheck size={13} />}
                                        <span>In Stock</span>
                                      </button>
                                    )}

                                    {/* Separate Live Button */}
                                    {isLive ? (
                                      <button
                                        type="button"
                                        className="admin-action-btn admin-btn-live-hide"
                                        style={{ flex: 1, minWidth: '120px', justifyContent: 'center' }}
                                        onClick={() => handleToggleLive(r)}
                                        disabled={isBusy}
                                      >
                                        {isBusy ? <Loader2 className="admin-spin" size={13} /> : <EyeOff size={13} />}
                                        <span>Make Not Live</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="admin-action-btn admin-btn-live-show"
                                        style={{ flex: 1, minWidth: '120px', justifyContent: 'center' }}
                                        onClick={() => handleToggleLive(r)}
                                        disabled={isBusy}
                                      >
                                        {isBusy ? <Loader2 className="admin-spin" size={13} /> : <Eye size={13} />}
                                        <span>Go Live</span>
                                      </button>
                                    )}
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()
              )}
            </section>
          )}

          {tab === 'add' && (
            <section className="admin-panel">
              <div className="admin-panel-head">
                <h2>{editingId ? 'Edit remedy' : 'Add a remedy'}</h2>
                <p>
                  {editingId
                    ? 'Update details below. Changes appear immediately on the storefront.'
                    : 'New remedies appear immediately on Home and Remedies pages.'}
                </p>
              </div>

              <form className="admin-remedy-form" onSubmit={handleSaveRemedy}>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label htmlFor="remedy-name">Name *</label>
                    <input
                      id="remedy-name"
                      name="name"
                      className="admin-input"
                      value={remedyForm.name}
                      onChange={handleRemedyChange}
                      placeholder="e.g. Belladonna 30C"
                      required
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="remedy-scientific">Scientific name</label>
                    <input
                      id="remedy-scientific"
                      name="scientificName"
                      className="admin-input"
                      value={remedyForm.scientificName}
                      onChange={handleRemedyChange}
                      placeholder="Botanical / source name"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="remedy-category">Category</label>
                    <input
                      id="remedy-category"
                      name="category"
                      className="admin-input"
                      value={remedyForm.category}
                      onChange={handleRemedyChange}
                      placeholder="e.g. Fever Care"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="remedy-price">Price (₹) *</label>
                    <input
                      id="remedy-price"
                      name="price"
                      type="number"
                      min="1"
                      className="admin-input"
                      value={remedyForm.price}
                      onChange={handleRemedyChange}
                      placeholder="180"
                      required
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="remedy-min">Minimum quantity</label>
                    <input
                      id="remedy-min"
                      name="minQuantity"
                      type="number"
                      min="1"
                      className="admin-input"
                      value={remedyForm.minQuantity}
                      onChange={handleRemedyChange}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="remedy-stock">Stock Units Available</label>
                    <input
                      id="remedy-stock"
                      name="stock"
                      type="number"
                      min="0"
                      className="admin-input"
                      value={remedyForm.stock}
                      onChange={handleRemedyChange}
                      placeholder="e.g. 30"
                    />
                  </div>
                  <div className="admin-field admin-field-full">
                    <label className="admin-toggle-card">
                      <input
                        type="checkbox"
                        name="isLive"
                        checked={Boolean(remedyForm.isLive)}
                        onChange={handleRemedyChange}
                        className="admin-toggle-checkbox"
                      />
                      <div className="admin-toggle-card-content">
                        <strong>Show on Website (Live)</strong>
                        <span>
                          When checked, this remedy is published and visible on the website. Unchecking sets it to <em>Not Live</em> (completely hidden from the website).
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="admin-field admin-field-full">
                    <label className="admin-toggle-card">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={Boolean(remedyForm.inStock)}
                        onChange={handleRemedyChange}
                        className="admin-toggle-checkbox"
                      />
                      <div className="admin-toggle-card-content">
                        <strong>In Stock (Available for Purchase)</strong>
                        <span>
                          When checked, this remedy can be added to the cart. Unchecking sets it to <em>Out of Stock</em> (shows an Out of Stock badge and disables checkout on the storefront).
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="admin-field admin-field-full">
                    <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: '600' }}>
                      Product Image (Upload new or keep existing)
                    </label>
                    <div className="admin-image-picker-card">
                      <div className="admin-image-preview-col">
                        <img
                          src={remedyForm.image || (editingId ? (remedies.find(r => r.id === editingId)?.image || '/remedy-bottle.png') : '/remedy-bottle.png')}
                          alt="Product preview"
                          className="admin-image-preview-thumb"
                        />
                        <span className="admin-image-preview-caption">
                          {remedyForm.image
                            ? 'New Image'
                            : editingId
                            ? 'Current Image'
                            : 'Default Bottle'}
                        </span>
                      </div>
                      <div className="admin-image-inputs-col">
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <label htmlFor="remedy-image-file-input" className="btn btn-outline" style={{ cursor: 'pointer', padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
                            <Upload size={14} />
                            <span>Choose Image from Device</span>
                          </label>
                          <input
                            id="remedy-image-file-input"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageFileChange}
                          />

                          {remedyForm.image && (
                            <button
                              type="button"
                              className="btn btn-outline"
                              style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                              onClick={() => setRemedyForm(prev => ({ ...prev, image: '' }))}
                              title="Reset / keep existing image"
                            >
                              <RotateCcw size={13} />
                              <span>Reset to Existing</span>
                            </button>
                          )}
                        </div>

                        <div style={{ marginTop: '0.65rem' }}>
                          <label htmlFor="remedy-image-url" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                            Or enter direct image URL:
                          </label>
                          <input
                            id="remedy-image-url"
                            name="image"
                            className="admin-input"
                            style={{ fontSize: '0.82rem' }}
                            value={remedyForm.image}
                            onChange={handleRemedyChange}
                            placeholder={editingId ? 'Leave blank to preserve current image' : 'e.g. /remedy-bottle.png or https://...'}
                          />
                        </div>

                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.35rem 0 0', lineHeight: 1.4 }}>
                          {editingId
                            ? '💡 If no new image is chosen, the currently existing image is preserved automatically.'
                            : '💡 If no image is provided, the standard amber glass remedy bottle is used.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="admin-field admin-field-full">
                    <label htmlFor="remedy-desc">Description</label>
                    <textarea
                      id="remedy-desc"
                      name="description"
                      className="admin-input admin-textarea"
                      rows={3}
                      value={remedyForm.description}
                      onChange={handleRemedyChange}
                      placeholder="Short description of uses"
                    />
                  </div>
                  <div className="admin-field admin-field-full">
                    <label htmlFor="remedy-benefits">Benefits (comma separated)</label>
                    <input
                      id="remedy-benefits"
                      name="benefits"
                      className="admin-input"
                      value={remedyForm.benefits}
                      onChange={handleRemedyChange}
                      placeholder="Relieves fever, Calms restlessness, Supports recovery"
                    />
                  </div>
                </div>

                <div className="admin-form-actions">
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        cancelEditRemedy();
                        setTab('remedies');
                      }}
                      disabled={savingRemedy}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary" disabled={savingRemedy}>
                    {savingRemedy ? (
                      <>
                        <Loader2 className="admin-spin" size={16} />
                        Saving…
                      </>
                    ) : editingId ? (
                      <>
                        <Pencil size={16} />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add Remedy
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          )}
      </main>
    </div>
  );
}
