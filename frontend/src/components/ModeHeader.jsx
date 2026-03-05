import '../styles/ModeHeader.css';

export function ModeHeader({ mode, onModeChange }) {
  return (
    <header className="mode-header">
      <h1 className="mode-header__title">Coupon Marketplace</h1>
      <div className="mode-header__buttons">
        <ModeButton
          active={mode === 'customer'}
          type="customer"
          onClick={() => onModeChange('customer')}
        >
          Customer
        </ModeButton>
        <ModeButton
          active={mode === 'admin'}
          type="admin"
          onClick={() => onModeChange('admin')}
        >
          Admin
        </ModeButton>
      </div>
    </header>
  );
}

function ModeButton({ active, type, onClick, children }) {
  const className = `mode-button ${active ? `mode-button--${type}` : 'mode-button--inactive'}`;
  
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

