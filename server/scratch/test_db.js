const { Pool } = require('pg');
const connectionString = "postgresql://postgres.utvearonnmhthhgkbrjo:Thaheshan0911@@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

console.log('Attempting to connect to:', connectionString.replace(/:[^:@]+@/, ':****@'));

pool.connect((err, client, release) => {
  if (err) {
    console.error('FAILED to connect:', err.message);
    console.error('Error Code:', err.code);
  } else {
    console.log('SUCCESSFULLY connected to the database!');
    release();
  }
  pool.end();
});
