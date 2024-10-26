import { Store } from "../models/store";
import { pool } from "../db/database";
import { Address } from "../models/address";

export const saveStore = async (store: Store) => {
  const storeExists = await checkStoreExists(
    store.getAddress().getZipCode(),
    store.getAddress().getNumber()
  );
  if (storeExists) {
    throw new Error("Já existe uma loja cadastrada com esse CEP e número.");
  }

  const addressQuery = `
    INSERT INTO addresses (zipCode, street, number, complement, neighborhood, city, state)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
  `;
  const addressValues = [
    store.getAddress().getZipCode(),
    store.getAddress().getStreet(),
    store.getAddress().getNumber(),
    store.getAddress().getComplement(),
    store.getAddress().getNeighborhood(),
    store.getAddress().getCity(),
    store.getAddress().getState(),
  ];

  let addressId: number;
  try {
    const addressResult = await pool.query(addressQuery, addressValues);
    addressId = addressResult.rows[0].id;
  } catch (error) {
    throw error;
  }

  const storeQuery = `
    INSERT INTO stores (name, document, documentType, addressId, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const storeValues = [
    store.getName(),
    store.getDocument(),
    store.getDocumentType(),
    addressId,
    store.getLatitude(),
    store.getLongitude(),
  ];

  try {
    const result = await pool.query(storeQuery, storeValues);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const checkStoreExists = async (
  zipCode: string,
  number: string
): Promise<boolean> => {
  const query = `
    SELECT s.*
    FROM stores s
    JOIN addresses a ON s.addressId = a.id
    WHERE a.zipCode = $1 AND a.number = $2;
  `;
  const values = [zipCode, number];
  try {
    const result = await pool.query<Store>(query, values);
    return result.rows.length > 0;
  } catch (error) {
    throw new Error("Erro ao verificar se a loja já existe");
  }
};

export const getAllStores = async (): Promise<Store[]> => {
  const query = `
    SELECT s.*, a.zipCode, a.street, a.number, a.complement, a.neighborhood, a.city, a.state
    FROM stores s
    LEFT JOIN addresses a ON s.addressId = a.id;
  `;
  try {
    const result = await pool.query(query);
    return result.rows.map((row: any) => {
      const address = new Address(
        row.addressId,
        row.zipCode,
        row.street,
        row.number,
        row.complement,
        row.neighborhood,
        row.city,
        row.state
      );
      return new Store(
        row.id,
        row.name,
        row.document,
        address,
        row.latitude,
        row.longitude,
        row.documentType
      );
    });
  } catch (error) {
    throw error;
  }
};
