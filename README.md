# Blue-Store
A simple e-commerce web application built with Node.js, Express, PostgreSQL, and Docker.

## Features

- 📦 Product catalog with images and descriptions
- 🛒 Shopping cart functionality
- 💳 Order placement with inventory management
- 🗄️ PostgreSQL database
- 🐳 Fully containerized with Docker

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL 15
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Containerization**: Docker & Docker Compose

## Project Structure

```
ecommerce-app/
├── docker-compose.yml      # Docker orchestration
├── Dockerfile             # Application container config
├── init.sql              # Database initialization
├── package.json          # Node.js dependencies
├── src/
│   ├── server.js        # Express server
│   └── database.js      # Database connection
└── public/
    └── index.html       # Frontend application
```

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation & Running

1. **Start the application:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Open your browser and visit: `http://localhost:3000`

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove all data:**
   ```bash
   docker-compose down -v
   ```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders

### Health
- `GET /api/health` - Health check

## Database Schema

### Products Table
- id (Primary Key)
- name
- description
- price
- stock
- image_url
- created_at

### Orders Table
- id (Primary Key)
- customer_name
- customer_email
- total_amount
- status
- created_at

### Order Items Table
- id (Primary Key)
- order_id (Foreign Key)
- product_id (Foreign Key)
- quantity
- price

## Default Database Credentials

- **Database**: ecommerce
- **User**: ecommerce
- **Password**: ecommerce123
- **Port**: 5432

## Sample Products

The database is initialized with 6 sample products:
1. Wireless Headphones - $79.99
2. Smart Watch - $199.99
3. Laptop Stand - $49.99
4. Mechanical Keyboard - $129.99
5. Wireless Mouse - $39.99
6. USB-C Hub - $59.99

## Features Demonstrated

- ✅ RESTful API design
- ✅ Database transactions for order processing
- ✅ Inventory management (stock updates)
- ✅ Responsive UI design
- ✅ Shopping cart with quantity controls
- ✅ Docker multi-container setup
- ✅ Health checks
- ✅ Database connection pooling

## Development

To make changes to the application:

1. Edit files in `src/` or `public/`
2. Restart the container:
   ```bash
   docker-compose restart app
   ```

For database changes, modify `init.sql` and rebuild:
```bash
docker-compose down -v
docker-compose up --build
```

## Troubleshooting

**Container fails to start:**
- Check if ports 3000 and 5432 are available
- Verify Docker is running

**Database connection error:**
- Wait a few seconds for database to initialize
- Check logs: `docker-compose logs db`

**Can't see products:**
- Check API health: `http://localhost:3000/api/health`
- Verify database initialized: `docker-compose logs db`

