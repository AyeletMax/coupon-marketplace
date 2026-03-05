import '../styles/AdminCouponRow.css';

export function AdminCouponRow({ coupon, onEdit, onDelete }) {
  return (
    <div className="admin-coupon-row">
      <img src={coupon.image_url} alt={coupon.name} className="admin-coupon-row__image" />
      <div className="admin-coupon-row__info">
        <h4 className="admin-coupon-row__name">{coupon.name}</h4>
        <p className="admin-coupon-row__description">{coupon.description}</p>
      </div>
      <div className="admin-coupon-row__price">
        <span className="admin-coupon-row__label">Cost:</span> ₪{Number(coupon.cost_price).toFixed(2)}
      </div>
      <div className="admin-coupon-row__price">
        <span className="admin-coupon-row__label">Sell:</span> ₪{Number(coupon.minimum_sell_price).toFixed(2)}
      </div>
      <div className="admin-coupon-row__status">
        {coupon.is_sold ? '✅ Sold' : '🟢 Available'}
      </div>
      <div className="admin-coupon-row__actions">
        <button onClick={() => onEdit(coupon)} className="admin-coupon-row__button admin-coupon-row__button--edit">
          Edit
        </button>
        <button onClick={() => onDelete(coupon.id)} className="admin-coupon-row__button admin-coupon-row__button--delete">
          Delete
        </button>
      </div>
    </div>
  );
}
