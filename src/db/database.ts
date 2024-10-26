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

const createAddressesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS addresses (
      id SERIAL PRIMARY KEY,
      zipCode VARCHAR(10),
      street VARCHAR(255),
      number VARCHAR(10),
      complement VARCHAR(255),
      neighborhood VARCHAR(255),
      city VARCHAR(255),
      state VARCHAR(255)

    );
  `;

  try {
    await pool.query(query);
  } catch (error) {
    handleError(
      error instanceof Error ? error : new Error(String(error)),
      "Erro ao criar endereços de tabela'"
    );
  }
};

const createStoresTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      document VARCHAR(50) NOT NULL,
      documentType VARCHAR(50) NOT NULL,
      addressId INTEGER REFERENCES addresses(id) ON DELETE CASCADE,
      latitude FLOAT,
      longitude FLOAT
    );
  `;

  try {
    await pool.query(query);
  } catch (error) {
    handleError(
      error instanceof Error ? error : new Error(String(error)),
      "Erro ao criar tabelas  de lojas '"
    );
  }
};

const createTables = async () => {
  await createAddressesTable();
  await createStoresTable();
};

const endPool = async () => {
  await pool.end();
};

export { createTables, pool, endPool };
