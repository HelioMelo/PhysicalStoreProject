import logger from "../utils/logger";
import axios from "axios";

const geocodeAddressApi = async (address: string) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 100,
        },
      }
    );

    if (response.status !== 200) {
      logger.error(
        `Erro na solicitação de geocodificação: ${response.statusText}`
      );
      throw new Error("Erro na solicitação de geocodificação.");
    }

    const data = response.data;
    if (data.length === 0) {
      logger.warn(`Coordenadas não encontradas para o endereço: ${address}`);
      throw new Error(
        "Não foi possível encontrar as coordenadas para o endereço."
      );
    }

    logger.info(`Geocodificação bem-sucedida para endereço: ${address}`);

    return {
      latitude: data[0].lat,
      longitude: data[0].lon,
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro de geocodificação: ${error.message}`);
      throw error;
    } else {
      logger.error(`Erro de geocodificação: ocorreu um erro desconhecido.`);
      throw new Error("Ocorreu um erro desconhecido");
    }
  }
};

export { geocodeAddressApi };
