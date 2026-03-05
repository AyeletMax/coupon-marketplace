import { CouponCard } from './CouponCard';
import '../styles/CouponGrid.css';

export function CouponGrid({ coupons, onPurchase }) {
  return (
    <div className="coupon-grid">
      {coupons.map((c) => (
        <CouponCard key={c.id} coupon={c} onPurchase={onPurchase} />
      ))}
    </div>
  );
}

