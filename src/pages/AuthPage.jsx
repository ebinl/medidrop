import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Lock, Mail, User } from 'lucide-react';
import { ADMIN_EMAIL, isAdminEmail, normalizeLoginEmail, useAuth } from '../context/AuthContext';

export default function AuthPage({ addToast, mode: modeProp }) {
  const { user, loading, isAdmin, login, signup, getErrorMessage } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const mode =
    modeProp ||
    (location.pathname.includes('signup') ? 'signup' : 'login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
  }, [mode]);

  if (!loading && (user || isAdmin)) {
    const redirectTo = location.state?.from || (isAdmin ? '/admin' : '/');
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Please enter email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!form.name.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (form.password.length < 6) {
        setError('Password should be at least 6 characters.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const created = await signup({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        addToast?.({
          title: 'Welcome to MEDI DROP',
          message: 'Your account was created successfully.',
          type: 'success',
        });
        const goAdmin = location.state?.from === '/admin' || isAdminEmail(created.email);
        navigate(goAdmin ? '/admin' : (location.state?.from || '/'), { replace: true });
      } else {
        const signedIn = await login({
          email: form.email,
          password: form.password,
        });
        addToast?.({
          title: 'Welcome back',
          message: isAdminEmail(signedIn?.email) || String(form.email).trim().toLowerCase() === 'admin'
            ? 'Signed in to the admin dashboard.'
            : 'You are signed in.',
          type: 'success',
        });
        const goAdmin =
          location.state?.from === '/admin' ||
          isAdminEmail(signedIn?.email) ||
          normalizeLoginEmail(form.email) === ADMIN_EMAIL;
        navigate(goAdmin ? '/admin' : (location.state?.from || '/'), {
          replace: true,
        });
      }
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <div className="auth-page">
      <div className="auth-page-inner">
        <form className="auth-card glass" onSubmit={handleSubmit}>
          <Link to="/" className="auth-logo-link" aria-label="MEDI DROP home">
            <img src="/medi-drop-logo-full.png" alt="MEDI DROP" className="auth-logo" />
          </Link>

          <div className="auth-tabs">
            <Link
              to="/login"
              className={`auth-tab ${!isSignup ? 'active' : ''}`}
              state={location.state}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`auth-tab ${isSignup ? 'active' : ''}`}
              state={location.state}
            >
              Sign Up
            </Link>
          </div>

          <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="auth-lead">
            {isSignup
              ? 'Join MEDI DROP to order remedies and book consultations.'
              : 'Sign in to continue shopping and managing your orders.'}
          </p>

          {isSignup && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <div className="auth-input-wrap">
                <User size={16} />
                <input
                  id="auth-name"
                  name="name"
                  className="auth-input"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <div className="auth-input-wrap">
              <Mail size={16} />
              <input
                id="auth-email"
                name="email"
                type="email"
                className="auth-input"
                value={form.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} />
              <input
                id="auth-password"
                name="password"
                type="password"
                className="auth-input"
                value={form.password}
                onChange={handleChange}
                placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
                minLength={6}
              />
            </div>
          </div>

          {isSignup && (
            <div className="auth-field">
              <label htmlFor="auth-confirm">Confirm password</label>
              <div className="auth-input-wrap">
                <Lock size={16} />
                <input
                  id="auth-confirm"
                  name="confirmPassword"
                  type="password"
                  className="auth-input"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting || loading}>
            {submitting ? (
              <>
                <Loader2 className="admin-spin" size={16} />
                {isSignup ? 'Creating account…' : 'Signing in…'}
              </>
            ) : isSignup ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>

          <p className="auth-switch">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link to="/login" state={location.state}>
                  Login
                </Link>
              </>
            ) : (
              <>
                New here?{' '}
                <Link to="/signup" state={location.state}>
                  Create an account
                </Link>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
