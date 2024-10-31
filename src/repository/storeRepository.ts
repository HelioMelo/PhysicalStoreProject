import { Store } from "../models/store";
import { pool } from "../db/database";
import { Address } from "../models/address";

const checkIfStoreExists = async (zipCode: string, number: string) => {
  const exists = await checkStoreExists(zipCode, number);
  if (exists) {
    throw new Error("Já existe uma loja cadastrada com esse CEP e número.");
  }
};

const saveAddress = async (store: Store): Promise<number> => {
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

  try {
    const addressResult = await pool.query(addressQuery, addressValues);
    return addressResult.rows[0].id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Erro ao salvar endereço: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao salvar endereço.");
    }
  }
};

const saveStoreToDb = async (store: Store, addressId: number) => {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Erro ao salvar loja: ${error.message}`);
    } else {
      throw new Error("Erro desconhecido ao salvar loja.");
    }
  }
};

export const saveStore = async (store: Store) => {
  await checkIfStoreExists(
    store.getAddress().getZipCode(),
    store.getAddress().getNumber()
  );
  const addressId = await saveAddress(store);
  return await saveStoreToDb(store, addressId);
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
    SELECT s.*, a.zipCode, a.street, a.number, a.complement, a.neighborhood, a.city, a.state, a.id as addressId
    FROM stores s
    LEFT JOIN addresses a ON s.addressId = a.id;
  `;
  try {
    const result = await pool.query(query);

    return result.rows.map((row: any) => {
      const address = new Address(
        row.addressid,
        row.zipcode,
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
        row.documenttype
      );
    });
  } catch (error) {
    console.error("Error occurred while getting stores:", error);
    throw error;
  }
};
