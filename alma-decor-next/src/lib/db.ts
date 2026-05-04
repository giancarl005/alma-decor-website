import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export const getDb = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'alma_decor',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    });
  }
  return pool;
};

// Helper for simple queries
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const db = getDb();
  const [rows] = await db.execute(sql, params);
  return rows as T;
}
