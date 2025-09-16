const { Pool } = require('pg');
require('dotenv').config();

console.log('Testando conexão com banco de dados...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()')
  .then(result => {
    console.log('✅ Conexão com banco OK:', result.rows[0]);
    pool.end();
  })
  .catch(err => {
    console.error('❌ Erro na conexão:', err);
    pool.end();
  });
