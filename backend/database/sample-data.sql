
DELETE FROM coupons;
DELETE FROM products;

INSERT INTO products (id, name, description, type, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Pizza Hut - Large Pizza', 'Family pizza + 1.5L drink', 'COUPON', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400');

INSERT INTO coupons (product_id, cost_price, margin_percentage, minimum_sell_price, value_type, value) VALUES
('11111111-1111-1111-1111-111111111111', 50.00, 20.00, 60.00, 'STRING', 'PIZZA-XYZ-12345');

INSERT INTO products (id, name, description, type, image_url) VALUES
('22222222-2222-2222-2222-222222222222', 'Spa Treatment', 'Couple spa treatment - 90 minutes', 'COUPON', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400');

INSERT INTO coupons (product_id, cost_price, margin_percentage, minimum_sell_price, value_type, value) VALUES
('22222222-2222-2222-2222-222222222222', 200.00, 15.00, 230.00, 'STRING', 'SPA-ABC-67890');

INSERT INTO products (id, name, description, type, image_url) VALUES
('33333333-3333-3333-3333-333333333333', 'Cinema City - 2 Tickets', '2 movie tickets + popcorn', 'COUPON', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400');

INSERT INTO coupons (product_id, cost_price, margin_percentage, minimum_sell_price, value_type, value) VALUES
('33333333-3333-3333-3333-333333333333', 80.00, 25.00, 100.00, 'STRING', 'CINEMA-QWE-99999');

INSERT INTO products (id, name, description, type, image_url) VALUES
('44444444-4444-4444-4444-444444444444', 'Fine Dining Experience', 'Romantic dinner for two in a chef restaurant', 'COUPON', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400');

INSERT INTO coupons (product_id, cost_price, margin_percentage, minimum_sell_price, value_type, value) VALUES
('44444444-4444-4444-4444-444444444444', 300.00, 30.00, 390.00, 'STRING', 'RESTO-ZXC-11111');

INSERT INTO products (id, name, description, type, image_url) VALUES
('55555555-5555-5555-5555-555555555555', 'Gym Membership - 3 Months', 'Gym membership for 3 months', 'COUPON', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400');

INSERT INTO coupons (product_id, cost_price, margin_percentage, minimum_sell_price, value_type, value) VALUES
('55555555-5555-5555-5555-555555555555', 400.00, 20.00, 480.00, 'STRING', 'GYM-FIT-55555');
