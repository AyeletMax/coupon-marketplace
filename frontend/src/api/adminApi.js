const API_BASE = '/api/admin';

function getToken() {
  return localStorage.getItem('adminToken');
}

function setToken(token) {
  localStorage.setItem('adminToken', token);
}

function removeToken() {
  localStorage.removeItem('adminToken');
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}


export async function adminLogin(password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Login failed');
  
  setToken(data.token);
  return data;
}

export function isAuthenticated() {
  return !!getToken();
}

export async function logout() {
  const token = getToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  removeToken();
}

export async function fetchAdminCoupons() {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: getAuthHeaders(),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        removeToken();
        throw new Error('Session expired. Please login again.');
      }
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to load coupons');
    }
    
    return await res.json();
  } catch (error) {
    if (error.message === 'Session expired. Please login again.') {
      throw error;
    }
    throw error;
  }
}

export async function createCoupon(couponData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(couponData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(data.message || 'Failed to create coupon');
  }
  return data;
}

export async function updateCoupon(id, couponData) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(couponData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      removeToken();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(data.message || 'Failed to update coupon');
  }
  return data;
}

export async function deleteCoupon(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      removeToken();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(data.message || 'Failed to delete coupon');
  }
}
