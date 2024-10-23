import axios from "axios";
import { handleError } from "../errors/errorHandlers"; // Importando manipulador de erros
import logger from "../utils/logger"; // Importando logger

const zipCodeApi = async (zipCode: string) => {
  logger.info(`Fetching data for ZIP code: ${zipCode}`);
  try {
    const response = await axios.get(
      `https://viacep.com.br/ws/${zipCode}/json/`
    );
    logger.info(`Response from ViaCEP: ${JSON.stringify(response.data)}`);

    if (response.data.erro) {
      throw new Error("ZIP code not found");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error, `Error fetching ZIP code: ${zipCode}`);
    } else {
      handleError(
        new Error("An unknown error occurred"),
        `Error fetching ZIP code: ${zipCode}`
      );
    }
    throw error;
  }
};

export { zipCodeApi };
