const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  const client = await db.getClient();
  
  try {
    const { customer_name, customer_email, items } = req.body;
    
    // Validate input
    if (!customer_name || !customer_email || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await client.query('BEGIN');
    
    // Calculate total
    let total = 0;
    for (const item of items) {
      const productResult = await client.query(
        'SELECT price, stock FROM products WHERE id = $1',
        [item.product_id]
      );
      
      if (productResult.rows.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }
      
      const product = productResult.rows[0];
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.product_id}`);
      }
      
      total += product.price * item.quantity;
    }
    
    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (customer_name, customer_email, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [customer_name, customer_email, total, 'pending']
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Create order items and update stock
    for (const item of items) {
      const productResult = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      );
      
      const price = productResult.rows[0].price;
      
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, price]
      );
      
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({ 
      message: 'Order created successfully', 
      order_id: orderId,
      total: total
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create order' });
  } finally {
    client.release();
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, 
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
});
