import { useState } from 'react';
import '../styles/CouponForm.css';

export function CouponForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    image_url: '',
    cost_price: '',
    margin_percentage: '',
    value_type: 'STRING',
    value: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="coupon-form-overlay" onClick={onCancel}>
      <form className="coupon-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="coupon-form__close" onClick={onCancel}>
          ×
        </button>
        
        <h3 className="coupon-form__title">
          {initialData ? 'Edit Coupon' : 'Create New Coupon'}
        </h3>

        <div className="coupon-form__content">
          <input
            name="name"
            placeholder="Coupon Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="coupon-form__input"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="coupon-form__textarea"
          />

          <input
            name="image_url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={handleChange}
            required
            className="coupon-form__input"
          />

          <input
            name="cost_price"
            type="number"
            step="0.01"
            placeholder="Cost Price"
            value={formData.cost_price}
            onChange={handleChange}
            required
            className="coupon-form__input"
          />

          <input
            name="margin_percentage"
            type="number"
            step="0.01"
            placeholder="Margin %"
            value={formData.margin_percentage}
            onChange={handleChange}
            required
            className="coupon-form__input"
          />

          <select
            name="value_type"
            value={formData.value_type}
            onChange={handleChange}
            className="coupon-form__select"
          >
            <option value="STRING">String</option>
            <option value="IMAGE">Image</option>
          </select>

          <input
            name="value"
            placeholder="Coupon Value (code/URL)"
            value={formData.value}
            onChange={handleChange}
            required
            className="coupon-form__input"
          />
        </div>

        <div className="coupon-form__buttons">
          <button type="submit" className="coupon-form__button coupon-form__button--submit">
            {initialData ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="coupon-form__button coupon-form__button--cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
