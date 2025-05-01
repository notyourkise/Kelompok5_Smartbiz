// config/db.js
const { Pool } = require('pg'); // Import the Pool class from the pg library

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  user: 'postgres',     // Default PostgreSQL user (or replace if different)
  host: 'localhost',    // Database host
  database: 'smartbizadmin', // Database name
  password: '1',        // Your PostgreSQL password
  port: 5432,           // Default PostgreSQL port
});

// Optional: Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database successfully!');
  client.query('SELECT NOW()', (err, result) => {
    release(); // Release the client back to the pool
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Current time from DB:', result.rows[0].now);
  });
});

module.exports = pool;
