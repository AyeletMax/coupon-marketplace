const API_BASE = '/api/admin';

export async function fetchAdminCoupons() {
  const res = await fetch(`${API_BASE}/coupons`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to load coupons');
  return data;
}

export async function createCoupon(couponData) {
  const res = await fetch(`${API_BASE}/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(couponData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to create coupon');
  return data;
}

export async function updateCoupon(id, couponData) {
  const res = await fetch(`${API_BASE}/coupons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(couponData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to update coupon');
  return data;
}

export async function deleteCoupon(id) {
  const res = await fetch(`${API_BASE}/coupons/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete coupon');
  }
}
