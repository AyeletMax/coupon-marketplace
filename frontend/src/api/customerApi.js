export async function fetchCustomerCoupons() {
  const res = await fetch('/api/customer/coupons');
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to load coupons');
  }
  return data;
}

export async function purchaseCustomerCoupon(productId) {
  const res = await fetch(`/api/customer/coupons/${productId}/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Purchase failed');
  }
  return data;
}

