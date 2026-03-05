import '../styles/PurchaseResult.css';

export function PurchaseResult({ result }) {
  if (!result) return null;

  return (
    <div className="purchase-result">
      <h3 className="purchase-result__title">Purchase successful</h3>
      <p className="purchase-result__info">
        <strong>Final price:</strong> ₪{Number(result.final_price).toFixed(2)}
      </p>
      <p className="purchase-result__info">
        <strong>Coupon value ({result.value_type}):</strong> <code>{result.value}</code>
      </p>
    </div>
  );
}

