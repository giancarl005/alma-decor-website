import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export const getDb = () => {
  if (!pool) {
    console.error('DEBUG DB: Connecting with almadeco_admin_alma');
    pool = mysql.createPool({
      host: 'localhost',
      user: 'almadeco_admin_alma',
      password: 'GCJ@8t&Z*2XooWeh',
      database: 'almadeco_alma_decor',
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
