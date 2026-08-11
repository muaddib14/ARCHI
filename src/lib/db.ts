export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  return [];
}

export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  return null;
}

export const db = {
  query,
  queryOne,
};
