# Database Access Guide

## Method 1: Using psql (Command Line)

### Connect to the database:
```bash
docker exec -it ecommerce-db psql -U ecommerce -d ecommerce
```

### Useful SQL Commands:

```sql
-- View all tables
\dt

-- View all products
SELECT * FROM products;

-- View all orders with details
SELECT 
    o.id,
    o.customer_name,
    o.customer_email,
    o.total_amount,
    o.status,
    o.created_at
FROM orders o
ORDER BY o.created_at DESC;

-- View order details with items
SELECT 
    o.id as order_id,
    o.customer_name,
    p.name as product_name,
    oi.quantity,
    oi.price,
    (oi.quantity * oi.price) as subtotal
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
ORDER BY o.id DESC;

-- Check product stock levels
SELECT id, name, stock, price FROM products ORDER BY stock;

-- Exit psql
\q
```

### Common psql Commands:
- `\dt` - List all tables
- `\d products` - Describe products table structure
- `\l` - List all databases
- `\q` - Quit psql

## Method 2: Using pgAdmin (Web Interface)

### Start pgAdmin:
1. Make sure pgAdmin is added to docker-compose.yml (already done!)
2. Restart containers: `docker-compose up -d`
3. Open browser: `http://localhost:5050`
4. Login:
   - Email: `admin@admin.com`
   - Password: `admin`

### Connect to Database in pgAdmin:
1. Click "Add New Server"
2. General tab:
   - Name: `Ecommerce DB`
3. Connection tab:
   - Host: `db` (or `ecommerce-db`)
   - Port: `5432`
   - Database: `ecommerce`
   - Username: `ecommerce`
   - Password: `ecommerce123`
4. Click "Save"

Now you can browse tables, run queries, and view data visually!

## Method 3: Using DBeaver / DataGrip / Other DB Tools

### Connection Details:
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `ecommerce`
- **Username**: `ecommerce`
- **Password**: `ecommerce123`

## Method 4: Direct Docker Database Shell

```bash
# Access the database container
docker exec -it ecommerce-db bash

# Then connect to PostgreSQL
psql -U ecommerce -d ecommerce
```

## Method 5: Using API Endpoints

You can also view data through the API:

```bash
# Get all products
curl http://localhost:3000/api/products

# Get all orders
curl http://localhost:3000/api/orders

# Get specific product
curl http://localhost:3000/api/products/1
```

## Quick Database Checks

### Check if database is running:
```bash
docker ps
```
Look for `ecommerce-db` container.

### View database logs:
```bash
docker logs ecommerce-db
```

### Restart database:
```bash
docker-compose restart db
```

### Reset database (WARNING: deletes all data):
```bash
docker-compose down -v
docker-compose up -d
```

## Sample Queries for Testing

```sql
-- Add a new product
INSERT INTO products (name, description, price, stock, image_url)
VALUES ('New Product', 'Description here', 99.99, 50, 'https://example.com/image.jpg');

-- Update product stock
UPDATE products SET stock = 100 WHERE id = 1;

-- Delete an order (and its items due to CASCADE)
DELETE FROM orders WHERE id = 1;

-- Get total revenue
SELECT SUM(total_amount) as total_revenue FROM orders;

-- Get most popular products
SELECT 
    p.name,
    SUM(oi.quantity) as times_ordered
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.name
ORDER BY times_ordered DESC;
```

## Troubleshooting

### Can't connect to database:
```bash
# Check if database is healthy
docker-compose ps

# Check database logs
docker logs ecommerce-db

# Restart the database
docker-compose restart db
```

### Forgot password:
The credentials are in `docker-compose.yml`:
- User: `ecommerce`
- Password: `ecommerce123`
- Database: `ecommerce`
