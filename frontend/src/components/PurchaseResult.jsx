import '../styles/PurchaseResult.css';

export function PurchaseResult({ result, onClose }) {
  if (!result) return null;

  return (
    <div className="purchase-result-overlay" onClick={onClose}>
      <div className="purchase-result" onClick={(e) => e.stopPropagation()}>
        <button className="purchase-result__close" onClick={onClose}>
          ×
        </button>
        <h3 className="purchase-result__title">Purchase successful</h3>
        <p className="purchase-result__info">
          <strong>Final price:</strong> ₪{Number(result.final_price).toFixed(2)}
        </p>
        <p className="purchase-result__info">
          <strong>Coupon value ({result.value_type}):</strong> <code>{result.value}</code>
        </p>
      </div>
    </div>
  );
}

