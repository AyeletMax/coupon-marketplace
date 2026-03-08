import { useEffect, useState } from 'react';
import { fetchAdminCoupons, createCoupon, updateCoupon, deleteCoupon, isAuthenticated, logout } from '../api/adminApi';
import { CouponForm } from './CouponForm';
import { AdminCouponRow } from './AdminCouponRow';
import { AdminLogin } from './AdminLogin';
import '../styles/AdminView.css';

export function AdminView() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    // Don't auto-set logged in state on mount
    // Let the user click login instead
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadCoupons();
    }
  }, [isLoggedIn]);

  async function loadCoupons() {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAdminCoupons();
      setCoupons(data);
    } catch (err) {
      if (err.message.includes('Session expired')) {
        setIsLoggedIn(false);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }



  async function handleCreate(formData) {
    try {
      setError('');
      await createCoupon(formData);
      setShowForm(false);
      await loadCoupons();
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Session expired')) {
        setIsLoggedIn(false);
      }
    }
  }

  async function handleUpdate(formData) {
    try {
      setError('');
      await updateCoupon(editingCoupon.id, formData);
      setEditingCoupon(null);
      await loadCoupons();
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Session expired')) {
        setIsLoggedIn(false);
      }
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      setError('');
      await deleteCoupon(id);
      await loadCoupons();
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Session expired')) {
        setIsLoggedIn(false);
      }
    }
  }

  function handleEdit(coupon) {
    setEditingCoupon(coupon);
    setShowForm(false);
  }

  function handleLoginSuccess() {
    setIsLoggedIn(true);
    setError('');
  }

  async function handleLogout() {
    await logout();
    setIsLoggedIn(false);
    setCoupons([]);
    setShowForm(false);
    setEditingCoupon(null);
    setError('');
  }

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const isFormOpen = showForm || !!editingCoupon;

  return (
    <div className="admin-view">
      <header className="admin-view__header">
        <h2 className="admin-view__title">Admin Mode</h2>
        <div className="admin-view__actions">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingCoupon(null);
            }}
            className="admin-view__button"
          >
            {showForm ? 'Cancel' : '+ New Coupon'}
          </button>
          <button
            onClick={handleLogout}
            className="admin-view__button admin-view__button--secondary"
          >
            Logout
          </button>
        </div>
      </header>

      {error && <p className="admin-view__error">{error}</p>}

      {loading && <p className="admin-view__loading">Loading...</p>}

      {!loading && coupons.length === 0 && (
        <p className="admin-view__empty">No coupons yet. Create your first one!</p>
      )}

      {!loading && coupons.length > 0 && (
        <div className="admin-view__list">
          {coupons.map(coupon => (
            <AdminCouponRow
              key={coupon.id}
              coupon={coupon}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="admin-view__modal-backdrop">
          <div className="admin-view__modal">
            <CouponForm
              initialData={editingCoupon || undefined}
              onSubmit={editingCoupon ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingCoupon(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

