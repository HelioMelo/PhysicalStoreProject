import { Store } from "../models/store";
import { pool } from "../db/database";

export const saveStore = async (store: Store) => {
  const query = `
    INSERT INTO stores (name, address, zipCode, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [
    store.getName(),
    store.getAddress(),
    store.getZipCode(),
    store.getLatitude(),
    store.getLongitude(),
  ];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao salvar a loja no banco de dados:", error);
    throw error;
  }
};

export const checkStoreExists = async (zipCode: string, number: string) => {
  const query = `
    SELECT * FROM stores
    WHERE zipCode = $1 AND address LIKE $2;
  `;
  const values = [zipCode, `%${number}%`];
  try {
    const result = await pool.query(query, values);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Erro ao verificar se a loja já existe:", error);
    throw error;
  }
};
export const getAllStores = async (): Promise<Store[]> => {
  const query = `SELECT * FROM stores`;
  try {
    const result = await pool.query(query);
    return result.rows.map(
      (row: any) =>
        new Store(
          row.name,
          row.address,
          row.zipCode,
          row.number,
          row.latitude,
          row.longitude
        )
    );
  } catch (error) {
    console.error("Erro ao buscar lojas no banco de dados:", error);
    throw error;
  }
};
