# Frontend Structure

## 📁 Directory Structure

```
frontend/src/
├── components/         # All React components
│   ├── AdminView.jsx       → Main admin screen
│   ├── CustomerView.jsx    → Main customer screen
│   ├── CouponCard.jsx      → Single coupon card
│   ├── CouponGrid.jsx      → Grid of coupons
│   ├── ModeHeader.jsx      → Header with mode toggle
│   └── PurchaseResult.jsx  → Purchase success message
├── styles/            # CSS files (one per component)
│   ├── AdminView.css
│   ├── CustomerView.css
│   ├── CouponCard.css
│   ├── CouponGrid.css
│   ├── ModeHeader.css
│   ├── PurchaseResult.css
│   └── App.css
├── api/               # API calls
│   ├── customerApi.js
│   └── adminApi.js
├── App.jsx            # Root component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🎯 Component Hierarchy

```
App.jsx (root component)
  ├── ModeHeader (mode toggle)
  └── CustomerView / AdminView (main views)
       └── CouponGrid
            └── CouponCard (x N)
```

## 📝 Naming Conventions

### Components
- **PascalCase** for file names: `CouponCard.jsx`
- **PascalCase** for component functions: `function CouponCard() {}`

### CSS Classes
- **BEM methodology** (Block Element Modifier):
  - Block: `.coupon-card`
  - Element: `.coupon-card__title`
  - Modifier: `.mode-button--active`

### CSS Files
- Same name as component: `CouponCard.jsx` → `CouponCard.css`
- Import at the top of the component: `import '../styles/CouponCard.css'`

## ✨ Guidelines

1. **Separation of concerns:**
   - Main views (CustomerView, AdminView) – with state and logic
   - Reusable components (CouponCard, CouponGrid) – presentational only
   - All styling lives in dedicated CSS files

2. **Styling:**
   - ✅ One CSS file per component
   - ✅ BEM naming convention
   - ❌ No unnecessary inline styles (only when dynamic, like `backgroundImage`)

3. **Clean code:**
   - One component per file
   - Clear, explicit props
   - Readable and well-structured code
