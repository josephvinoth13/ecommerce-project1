import { useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../../api';
import { saveAuthSession } from '../../auth';
import './LoginPage.css';

export function LoginPage({ onAuthenticated }) {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const response = await api.post(endpoint, form);
      saveAuthSession(response.data.token);
      onAuthenticated(response.data.user);
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to authenticate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>{isRegistering ? 'Create your account' : 'Welcome back'}</h1>
        <p className="login-subtitle">
          {isRegistering ? 'Register to manage your orders.' : 'Log in to view and manage your orders.'}
        </p>

        {isRegistering && (
          <label>
            Name
            <input name="name" value={form.name} onChange={updateField} required minLength="2" />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={updateField} required minLength="8" />
        </label>

        {error && <p className="login-error" role="alert">{error}</p>}
        <button type="submit" className="login-submit button-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : isRegistering ? 'Create account' : 'Log in'}
        </button>
        <button
          type="button"
          className="login-switch"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }}
        >
          {isRegistering ? 'Already have an account? Log in' : 'New customer? Create an account'}
        </button>
      </form>
    </main>
  );
}
