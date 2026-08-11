import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon') ? { rejectUnauthorized: false } : false,
});

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows as T[];
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  try {
    const result = await query<T>(text, params);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Database queryOne error:', error);
    throw error;
  }
}

export const db = {
  query,
  queryOne,
};
