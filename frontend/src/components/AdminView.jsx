import { useEffect, useState } from 'react';
import { fetchAdminCoupons, createCoupon, updateCoupon, deleteCoupon } from '../api/adminApi';
import { CouponForm } from './CouponForm';
import { AdminCouponRow } from './AdminCouponRow';
import '../styles/AdminView.css';

export function AdminView() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  async function loadCoupons() {
    try {
      setLoading(true);
      setError('');
      const data = await fetchAdminCoupons();
      setCoupons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function handleCreate(formData) {
    try {
      setError('');
      await createCoupon(formData);
      setShowForm(false);
      await loadCoupons();
    } catch (err) {
      setError(err.message);
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
    }
  }

  function handleEdit(coupon) {
    setEditingCoupon(coupon);
    setShowForm(false);
  }

  return (
    <div className="admin-view">
      <header className="admin-view__header">
        <h2 className="admin-view__title">Admin Mode</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCoupon(null);
          }}
          className="admin-view__button"
        >
          {showForm ? 'Cancel' : '+ New Coupon'}
        </button>
      </header>

      {error && <p className="admin-view__error">{error}</p>}

      {showForm && (
        <CouponForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingCoupon && (
        <CouponForm
          initialData={editingCoupon}
          onSubmit={handleUpdate}
          onCancel={() => setEditingCoupon(null)}
        />
      )}

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
    </div>
  );
}

