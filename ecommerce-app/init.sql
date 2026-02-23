-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Insert sample products
INSERT INTO products (name, description, price, stock, image_url) VALUES
('Wireless Headphones', 'High-quality Bluetooth headphones with noise cancellation', 79.99, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
('Smart Watch', 'Fitness tracker with heart rate monitor and GPS', 199.99, 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
('Laptop Stand', 'Ergonomic aluminum laptop stand for better posture', 49.99, 100, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'),
('Mechanical Keyboard', 'RGB backlit mechanical gaming keyboard', 129.99, 25, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'),
('Wireless Mouse', 'Precision wireless mouse with programmable buttons', 39.99, 75, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400'),
('USB-C Hub', '7-in-1 USB-C hub with HDMI and ethernet', 59.99, 60, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400');
