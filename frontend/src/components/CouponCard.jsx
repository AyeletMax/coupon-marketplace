import '../styles/CouponCard.css';

export function CouponCard({ coupon, onPurchase }) {
  return (
    <div className="coupon-card">
      <div
        className="coupon-card__image"
        style={{ backgroundImage: `url(${coupon.image_url})` }}
      />
      <h3 className="coupon-card__title">{coupon.name}</h3>
      {coupon.description && (
        <p className="coupon-card__description">{coupon.description}</p>
      )}
      <p className="coupon-card__price">
        Price: ₪{Number(coupon.price).toFixed(2)}
      </p>
      <button
        onClick={() => onPurchase(coupon.id)}
        className="coupon-card__button"
      >
        Purchase
      </button>
    </div>
  );
}

