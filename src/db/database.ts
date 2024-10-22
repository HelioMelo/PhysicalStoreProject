import pkg from "pg";
import dotenv from "dotenv";
import { handleError } from "../errors/errorHandlers";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
});

const createStoresTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      address VARCHAR(255),
      zipCode VARCHAR(10),
      latitude FLOAT,
      longitude FLOAT
    );
  `;

  try {
    await pool.query(query);
    console.log("Stores table created or already exists.");
  } catch (error) {
    handleError(
      error instanceof Error ? error : new Error(String(error)),
      "Error creating table 'stores'"
    );
  }
};

const getStores = async (query?: string, values?: any[]): Promise<any[]> => {
  try {
    const result = await pool.query(query || "SELECT * FROM stores", values);
    return result.rows;
  } catch (error) {
    handleError(
      error instanceof Error ? error : new Error(String(error)),
      "Error fetching stores"
    );
    return [];
  }
};

const endPool = async () => {
  await pool.end();
};

export { createStoresTable, getStores, pool, endPool };
