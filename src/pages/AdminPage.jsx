import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
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
} from 'lucide-react';
import { subscribeContacts } from '../services/contacts';
import { subscribeConsultations } from '../services/consultations';
import { addRemedy, seedDefaultRemedies, subscribeRemedies, updateRemedy } from '../services/remedies';

const ADMIN_SESSION_KEY = 'medidrop-admin-auth';

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
  const [isAuthed, setIsAuthed] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'admin') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
      setIsAuthed(true);
      setLoginError('');
      setPassword('');
      addToast?.({
        title: 'Welcome',
        message: 'Signed in to the admin dashboard.',
        type: 'success',
      });
      return;
    }
    setLoginError('Invalid username or password.');
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthed(false);
    setUsername('');
    setPassword('');
    setTab('contacts');
    setEditingId(null);
    setRemedyForm(emptyRemedy);
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

  if (!isAuthed) {
    return (
      <div className="admin-page">
        <div className="admin-login-wrap">
          <form className="admin-login-card glass" onSubmit={handleLogin}>
            <div className="admin-login-badge">
              <ShieldCheck size={18} />
              Admin Access
            </div>
            <h1>MEDI DROP Admin</h1>
            <p>Sign in to review contact messages and manage remedies.</p>

            <label htmlFor="admin-user">Username</label>
            <input
              id="admin-user"
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />

            <label htmlFor="admin-pass">Password</label>
            <input
              id="admin-pass"
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {loginError && <p className="admin-error">{loginError}</p>}

            <button type="submit" className="btn btn-primary admin-login-btn">
              Sign In
            </button>

            <Link to="/" className="admin-back-link">
              ← Back to website
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <div className="admin-brand">
          <LayoutDashboard size={20} />
          <div>
            <strong>MEDI DROP Admin</strong>
            <span>Dashboard</span>
          </div>
        </div>
        <div className="admin-top-actions">
          <Link to="/" className="admin-link-btn">
            View site
          </Link>
          <button type="button" className="btn btn-outline admin-logout" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="admin-shell">
        <nav className="admin-nav">
          <button
            type="button"
            className={`admin-nav-btn ${tab === 'contacts' ? 'active' : ''}`}
            onClick={() => setTab('contacts')}
          >
            <MessageSquare size={16} />
            Contacts
            <span className="admin-count">{contacts.length}</span>
          </button>
          <button
            type="button"
            className={`admin-nav-btn ${tab === 'consultations' ? 'active' : ''}`}
            onClick={() => setTab('consultations')}
          >
            <Video size={16} />
            Consultations
            <span className="admin-count">{consultations.length}</span>
          </button>
          <button
            type="button"
            className={`admin-nav-btn ${tab === 'remedies' ? 'active' : ''}`}
            onClick={() => setTab('remedies')}
          >
            <Pill size={16} />
            Remedies
            <span className="admin-count">{remedies.length}</span>
          </button>
          <button
            type="button"
            className={`admin-nav-btn ${tab === 'add' ? 'active' : ''}`}
            onClick={() => {
              setEditingId(null);
              setRemedyForm(emptyRemedy);
              setTab('add');
            }}
          >
            <Plus size={16} />
            {editingId ? 'Editing…' : 'Add Remedy'}
          </button>
        </nav>

        <main className="admin-main">
          {dataError && <div className="admin-banner">{dataError}</div>}

          {tab === 'contacts' && (
            <section className="admin-panel">
              <div className="admin-panel-head">
                <h2>Contact form submissions</h2>
                <p>Messages sent from the public contact page.</p>
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
                    <article key={item.id} className="admin-contact-card">
                      <div className="admin-contact-top">
                        <h3>{item.name}</h3>
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
                <p>Bookings from the video consultation form (₹200).</p>
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
                          ₹{item.amount || 200} · {(item.paymentMethod || 'upi').toUpperCase()}
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
                <div className="admin-remedy-table-wrap">
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
    </div>
  );
}
