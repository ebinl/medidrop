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
  Video,
  Calendar,
  Pencil,
  X,
  Menu,
  CheckCheck,
  Trash2,
  EyeOff,
} from 'lucide-react';
import {
  clearAllContacts,
  deleteContact,
  markContactRead,
  subscribeContacts,
} from '../services/contacts';
import { subscribeConsultations } from '../services/consultations';
import { addRemedy, seedDefaultRemedies, subscribeRemedies, updateRemedy } from '../services/remedies';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS = [
  { id: 'contacts', label: 'Contacts', icon: MessageSquare },
  { id: 'consultations', label: 'Consultations', icon: Video },
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
  benefits: '',
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
  const [remedies, setRemedies] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [loadingRemedies, setLoadingRemedies] = useState(true);
  const [dataError, setDataError] = useState('');
  const [remedyForm, setRemedyForm] = useState(emptyRemedy);
  const [editingId, setEditingId] = useState(null);
  const [savingRemedy, setSavingRemedy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactBusyId, setContactBusyId] = useState(null);
  const [clearingContacts, setClearingContacts] = useState(false);

  const isAuthed = Boolean(isAdmin);

  const unreadContacts = contacts.filter((c) => !c.read).length;

  const getMenuCount = (id) => {
    if (id === 'contacts') return unreadContacts || contacts.length;
    if (id === 'consultations') return consultations.length;
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
    setLoadingRemedies(true);

    let unsubContacts = () => {};
    let unsubConsultations = () => {};
    let unsubRemedies = () => {};
    let cancelled = false;

    (async () => {
      try {
        await seedDefaultRemedies();
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setDataError('Could not seed remedies. Check Firestore rules and that the database is created.');
        }
      }

      if (cancelled) return;

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

      unsubRemedies = subscribeRemedies(
        (items) => {
          setRemedies(items);
          setLoadingRemedies(false);
        },
        (err) => {
          console.error(err);
          setLoadingRemedies(false);
          setDataError('Could not load remedies. Check Firestore rules and that the database is created.');
        }
      );
    })();

    return () => {
      cancelled = true;
      unsubContacts();
      unsubConsultations();
      unsubRemedies();
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
    const { name, value } = e.target;
    setRemedyForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEditRemedy = (remedy) => {
    setEditingId(remedy.id);
    setRemedyForm({
      name: remedy.name || '',
      scientificName: remedy.scientificName || '',
      category: remedy.category || '',
      description: remedy.description || '',
      price: String(remedy.price ?? ''),
      minQuantity: String(remedy.minQuantity ?? 1),
      benefits: Array.isArray(remedy.benefits) ? remedy.benefits.join(', ') : '',
    });
    setTab('add');
    setMenuOpen(false);
  };

  const cancelEditRemedy = () => {
    setEditingId(null);
    setRemedyForm(emptyRemedy);
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
    try {
      if (editingId) {
        await updateRemedy(editingId, remedyForm);
        addToast?.({
          title: 'Remedy Updated',
          message: 'Changes are live on the storefront.',
          type: 'success',
        });
      } else {
        await addRemedy(remedyForm);
        addToast?.({
          title: 'Remedy Added',
          message: 'The new remedy is live on the storefront.',
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
        message: editingId
          ? 'Could not update remedy. Check Firestore permissions.'
          : 'Could not add remedy. Check Firestore permissions.',
        type: 'error',
      });
    } finally {
      setSavingRemedy(false);
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

          {tab === 'consultations' && (
            <section className="admin-panel">
              <div className="admin-panel-head">
                <h2>Doctor consultations</h2>
                <p>Bookings from the video consultation form (₹49).</p>
              </div>

              {loadingConsultations ? (
                <div className="admin-empty">
                  <Loader2 className="admin-spin" size={22} />
                  Loading consultations…
                </div>
              ) : consultations.length === 0 ? (
                <div className="admin-empty">No consultation bookings yet.</div>
              ) : (
                <div className="admin-contact-list">
                  {consultations.map((item) => (
                    <article key={item.id} className="admin-contact-card">
                      <div className="admin-contact-top">
                        <h3>{item.name}</h3>
                        <span>
                          <Clock size={13} />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      <p className="admin-subject">
                        <Calendar size={13} />
                        {' '}
                        {item.date} · {item.time}
                      </p>

                      <p className="admin-message">
                        <strong>Symptoms:</strong> {item.symptoms}
                      </p>

                      <div className="admin-consult-pay">
                        <span className="admin-pay-badge">
                          ₹{item.amount || 49} · {(item.paymentMethod || 'upi').toUpperCase()}
                        </span>
                        {item.paymentMethod === 'upi' && item.upiRefNo && (
                          <span>UPI Ref: {item.upiRefNo}</span>
                        )}
                        {item.paymentMethod === 'card' && (
                          <span>
                            Card{item.cardLast4 ? ` •••• ${item.cardLast4}` : ''}
                            {item.cardHolder ? ` · ${item.cardHolder}` : ''}
                          </span>
                        )}
                      </div>

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
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === 'remedies' && (
            <section className="admin-panel">
              <div className="admin-panel-head">
                <h2>All remedies</h2>
                <p>Catalog stored in Firebase — includes the original 10 remedies plus any you add.</p>
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
                <>
                  <div className="admin-remedy-table-wrap admin-remedy-desktop">
                    <table className="admin-remedy-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Min qty</th>
                          <th>Source</th>
                          <th>Added</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {remedies.map((r) => (
                          <tr key={r.id}>
                            <td>
                              <strong>{r.name}</strong>
                              <span>{r.scientificName}</span>
                            </td>
                            <td>{r.category || '—'}</td>
                            <td>₹{r.price}</td>
                            <td>{r.minQuantity}</td>
                            <td>{r.isDefault ? 'Catalog' : 'Added'}</td>
                            <td>{formatDate(r.createdAt)}</td>
                            <td>
                              <button
                                type="button"
                                className="admin-edit-btn"
                                onClick={() => startEditRemedy(r)}
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-remedy-cards admin-remedy-mobile">
                    {remedies.map((r) => (
                      <article key={r.id} className="admin-remedy-card">
                        <div className="admin-remedy-card-top">
                          <div>
                            <h3>{r.name}</h3>
                            {r.scientificName && <p>{r.scientificName}</p>}
                          </div>
                          <button
                            type="button"
                            className="admin-edit-btn"
                            onClick={() => startEditRemedy(r)}
                          >
                            <Pencil size={14} />
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
                            <dt>Min qty</dt>
                            <dd>{r.minQuantity}</dd>
                          </div>
                          <div>
                            <dt>Source</dt>
                            <dd>{r.isDefault ? 'Catalog' : 'Added'}</dd>
                          </div>
                        </dl>
                        <span className="admin-remedy-card-date">
                          <Clock size={12} />
                          {formatDate(r.createdAt)}
                        </span>
                      </article>
                    ))}
                  </div>
                </>
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
