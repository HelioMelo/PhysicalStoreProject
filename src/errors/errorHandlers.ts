import logger from "../utils/logger";
import { Response } from "express";

// Função para validar o DTO da loja
export const validateStoreDTO = (storeDTO: any): void => {
  if (!storeDTO.name || storeDTO.name.trim().length === 0) {
    throw new Error("O nome da loja é obrigatório.");
  }

  const cepPattern = /^[0-9]{8}$/;
  if (!cepPattern.test(storeDTO.zipCode)) {
    throw new Error(
      "O CEP deve conter apenas números e ter exatamente 8 dígitos."
    );
  }
};

// Função para manipular erros genéricos
const handleError = (error: unknown, message: string): string => {
  let errorMessage: string;
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = String(error);
  }
  logger.error(`${message}: ${errorMessage}`);
  return errorMessage;
};

const handleValidationError = (message: string): string => {
  logger.warn(message);
  return message;
};

const handleNotFoundError = (message: string): string => {
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

export { handleError, handleValidationError, handleNotFoundError };
