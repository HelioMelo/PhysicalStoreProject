import logger from "../utils/logger";
import axios from "axios";

const geocodeAddressApi = async (
  street: string,
  state: string,
  city: string
) => {
  try {
    logger.info(`Starting geocoding for: ${street}, ${state}, ${city}`);

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          street: street,
          state: state,
          city: city,
          format: "json",
          limit: 1,
        },
      }
    );

    if (response.status !== 200) {
      logger.error(
        `Erro de solicitação de geocodificação: ${response.statusText}`
      );
      throw new Error("Erro de solicitação de geocodificação.");
    }

    const data = response.data;
    if (data.length === 0) {
      logger.warn(`Coordenadas não encontradas para o endereço: ${street}`);
      throw new Error("Não foi possível encontrar as coordenadas do endereço.");
    }

    logger.info(`Geocodificação bem-sucedida para endereço: ${street}`);
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Erro de geocodificação: ${error.message}`);
      throw error;
    } else {
      logger.error(`Erro de geocodificação: ocorreu um erro desconhecido.`);
      throw new Error("O correu um erro desconhecido");
    }
  }
};

export { geocodeAddressApi };
