import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'martinezvideo.mysql.uhserver.com',
  user: process.env.DB_USER || 'winchester123',
  password: process.env.DB_PASSWORD || '@Saopaulop45',
  database: process.env.DB_NAME || 'martinezvideo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
