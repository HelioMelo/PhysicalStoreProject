import { logError } from "../utils/logger";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export function handleKnownErrors(error: any): string {
  let errorMessage: string;

  if (error instanceof ValidationError) {
    errorMessage = error.message;
    logError("Erro de validação", errorMessage);
  } else if (error instanceof DatabaseError) {
    errorMessage = error.message;
    logError("Erro no banco de dados", errorMessage);
  } else if (error instanceof Error) {
    errorMessage = error.message;
    logError("Erro inesperado", errorMessage);
  } else {
    errorMessage = "Erro desconhecido.";
    logError("Erro desconhecido", error);
  }

  return errorMessage;
}
