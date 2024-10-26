import { Store } from "../models/store";
import { checkStoreExists, saveStore } from "../repository/storeRepository";
import logger from "../utils/logger";
import { Response } from "express";

export const handleStoreSave = async (storeData: Store) => {
  const zipCode = storeData.getAddress().getZipCode();
  const number = storeData.getAddress().getNumber();

  const storeExists = await checkStoreExists(zipCode, number);

  if (storeExists) {
    throw new Error("A loja já existe");
  }

  return await saveStore(storeData);
};

export const validateStoreDTO = (storeDTO: any): void => {
  if (!storeDTO.name || storeDTO.name.trim().length === 0) {
    throw new Error("O nome da loja é obrigatório.");
  }

  const cepPattern = /^[0-9]{8}$/;
  if (!storeDTO.address.zipCode || !cepPattern.test(storeDTO.address.zipCode)) {
    throw new Error(
      "O CEP deve conter apenas números e ter exatamente 8 dígitos."
    );
  }

  if (!storeDTO.document || storeDTO.document.trim().length === 0) {
    throw new Error("O documento da loja é obrigatório.");
  }
};

export function handleError(error: any, context: string): string {
  let errorMessage: string;
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = String(error);
  }
  logger.error(`${context}: ${errorMessage}`);
  return errorMessage;
}

export const handleValidationError = (message: string): string => {
  logger.warn(message);
  return message;
};

export const handleNotFoundError = (message: string): string => {
  logger.warn(message);
  return message;
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
): void => {
  logger.error(message);
  res.status(statusCode).json({ error: message });
};
