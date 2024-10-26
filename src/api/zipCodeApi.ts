import axios from "axios";
import { handleError } from "../errors/errorHandlers";
import logger from "../utils/logger";

const zipCodeApi = async (zipCode: string) => {
  logger.info(`Fetching data for ZIP code: ${zipCode}`);
  try {
    const response = await axios.get(
      `https://viacep.com.br/ws/${zipCode}/json/`
    );
    logger.info(`Response from ViaCEP: ${JSON.stringify(response.data)}`);

    if (response.data.erro) {
      throw new Error("CEP não encontrado");
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error, `Erro ao buscar o CEP: ${zipCode}`);
    } else {
      handleError(
        new Error("O correu um erro desconhecido"),
        `Erro ao buscar o CEP: ${zipCode}`
      );
    }
    throw error;
  }
};

export { zipCodeApi };
