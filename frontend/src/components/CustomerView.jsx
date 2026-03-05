import { useEffect, useState } from 'react';
import { fetchCustomerCoupons, purchaseCustomerCoupon } from '../api/customerApi';
import { CouponGrid } from '../components/CouponGrid';
import { PurchaseResult } from '../components/PurchaseResult';
import '../styles/CustomerView.css';

export function CustomerView() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaseResult, setPurchaseResult] = useState(null);

  async function loadCoupons() {
    try {
      setLoading(true);
      setError('');
      const data = await fetchCustomerCoupons();
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

  async function handlePurchase(id) {
    try {
      setError('');
      setPurchaseResult(null);
      const result = await purchaseCustomerCoupon(id);
      setPurchaseResult(result);
      await loadCoupons();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="customer-view">
      <header className="customer-view__header">
        <h2 className="customer-view__title">Customer Mode</h2>
        <p className="customer-view__subtitle">
          Choose a coupon and purchase it. Price is fixed (minimum sell price).
        </p>
      </header>

      {loading && <p className="customer-view__loading">Loading coupons...</p>}
      {error && <p className="customer-view__error">{error}</p>}

      {!loading && coupons.length === 0 && !error && (
        <p className="customer-view__empty">No coupons available at the moment.</p>
      )}

      {!loading && coupons.length > 0 && (
        <CouponGrid coupons={coupons} onPurchase={handlePurchase} />
      )}

      <PurchaseResult result={purchaseResult} />
    </div>
  );
}

