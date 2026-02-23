const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://ecommerce:ecommerce123@db:5432/ecommerce',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
