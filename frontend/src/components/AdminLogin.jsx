import { useState } from 'react';
import { adminLogin } from '../api/adminApi';
import '../styles/AdminLogin.css';

export function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await adminLogin(password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__container">
        <h2 className="admin-login__title">Admin Login</h2>
        <p className="admin-login__subtitle">Enter admin password to continue</p>
        
        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-login__field">
            <label htmlFor="password" className="admin-login__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-login__input"
              placeholder="Enter admin password"
              disabled={loading}
            />
          </div>
          
          {error && <p className="admin-login__error">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="admin-login__button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}